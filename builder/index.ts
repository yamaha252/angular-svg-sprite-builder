import {BuilderContext, BuilderOutput, createBuilder} from '@angular-devkit/architect';
import {JsonObject} from '@angular-devkit/core';
import * as SVGSpriter from 'svg-sprite';
import {mkdirSync, readFileSync, writeFileSync} from 'fs';
import {basename, dirname} from 'path';
import {glob} from 'glob';

interface Options extends JsonObject {
    source: string;
    destination: string;
    shape: any,
    svg: any,
}

export default createBuilder(copyFileBuilder);

async function copyFileBuilder(
    options: Options,
    context: BuilderContext,
): Promise<BuilderOutput> {

    context.reportStatus(`Compiling ${options.source} into ${options.destination}.`);

    try {
        const resultFilePath = await compile(options);
        context.reportStatus('Done.');
        context.logger.info('Compiled: ' + resultFilePath);
        return {success: true};
    } catch (e) {
        context.reportStatus('Error.');
        context.logger.error('Compilation failed.');
        return {
            success: false,
            error: e.message
        }
    }
}

function compile(options: Options) {
    const spriter = new SVGSpriter({
        mode: {
            symbol: true
        },
        ...options.shape ? {shape: options.shape} : {},
        ...options.svg ? {shape: options.svg} : {},
    });

    return new Promise((resolve, reject) => {
        glob(options.source, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            if (!files.length) {
                reject(new Error('No source files found'));
                return;
            }

            files.forEach(file => {
                spriter.add(file, basename(file), readFileSync(file, {encoding: 'utf-8'}));
            });

            spriter.compile(function (error, result) {
                if (error) {
                    reject(new Error(error.message));
                    return;
                }

                const file = result.symbol.sprite;
                if (file) {
                    mkdirSync(dirname(options.destination), {recursive: true});
                    writeFileSync(options.destination, file.contents);
                    resolve(options.destination);
                    return;
                }

                reject(new Error('Got no result file'));
            });
        });
    });
}
