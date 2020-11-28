mod utils;

use wasm_bindgen::prelude::*;

use fancy_regex::*;
use js_sys::Array;
use serde::{Deserialize, Serialize};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn log(a: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, hello-wasm!");
}

#[wasm_bindgen]
pub fn check_regex(regex_source: &str, text: &str) -> Array {
    // проброс ошибок в console.log
    utils::set_panic_hook();
    let regex = Regex::new(&regex_source).unwrap();
    let mut old_position = 0;
    let mut position = 0;
    let mut result: Vec<usize> = vec![];
    while position < text.len() {
        if let Some(caps) = regex.captures_from_pos(&text, position).unwrap() {
            // console_log!("captures:{:#?}, position: {}", caps, position);
            // количество групп
            // if position == 0 {
            //     // количество групп
            //     result.push(caps.len() as i32);
            // }
            // let mut indexes: Vec<usize> = vec![];
            for i in 0..caps.len() {
                if let Some(m) = caps.get(i) {
                    let start_i = m.start();
                    let end_i = m.end();
                    // номер группы
                    result.push(i);
                    // пары индексов начала и конца для каждой группы
                    result.push(start_i);
                    result.push(end_i);
                    if i == 0 {
                        position += end_i;
                    }
                }
            }
            if position == old_position {
                // не должно произойти, так как если есть совпадение, то оно должно соответствовать нулевой группе
                position += 1;
                old_position = position;
            }
        } else {
            position = text.len();
            old_position = position;
        }
    }
    result
        .into_iter()
        .map(|x| JsValue::from(x as i32))
        .collect()
}
