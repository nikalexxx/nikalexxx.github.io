import * as wasmTypes from '../../../regex/pkg/fantasy_regex';

import { CaptureGroups } from '../model';
// @ts-ignore-line
import module from '../../../regex/Cargo.toml';

// import check_regex from '../../../regex/pkg/fantasy_regex_bg.wasm';

/**
 * wasm port
 */
const checkWasmRegex = module.check_regex as unknown as typeof wasmTypes.check_regex;

// TODO: возможность искать только до первого совпадения в целях оптимизации
export function checkRegex(regexSource: string, text: string): CaptureGroups[] {
    try {
        // console.log('1');
        const indexes = checkWasmRegex(regexSource, text);
        // console.log('2');
        const result: CaptureGroups[] = [];
        let current: CaptureGroups = {};
        for (let i = 0; i < indexes.length; i += 3) {
            const groupName = indexes[i];
            if (groupName === 0) {
                if (Object.keys(current).length > 0) {
                    result.push(JSON.parse(JSON.stringify(current)));
                }
                current = {};
            }
            current[groupName] = [indexes[i + 1], indexes[i + 2]];
        }
        if (Object.keys(current).length > 0) {
            result.push(JSON.parse(JSON.stringify(current)));
        }

        return result;
    } catch (e) {
        console.error(e);
        console.log({regexSource, text});
        return [];
    }
}

console.dir(checkRegex('s(a)', 'sasa'));
