mod utils;

use wasm_bindgen::prelude::*;

use fancy_regex::*;
use js_sys::Array;
use serde::{Serialize, Deserialize};



// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
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
    // utils::set_panic_hook();
    let regex = Regex::new(&regex_source).unwrap();
    let mut position = 0;
    let mut result: Vec<usize> = vec![];
    while position < text.len() {
        // console_log!("position: {}", position);
        if let Some(caps) = regex.captures_from_pos(&text, position).unwrap() {
            // console_log!("captures:{:#?}", caps);
            // количество групп
            // if position == 0 {
            //     // количество групп
            //     result.push(caps.len() as i32);
            // }
            // let mut indexes: Vec<usize> = vec![];
            for i in 0..caps.len() {
                // console_log!(" {}:", i);
                if let Some(m) = caps.get(i) {
                    let start_i = m.start();
                    let end_i = m.end();
                    // номер группы
                    result.push(i);
                    // пары индексов начала и конца для каждой группы
                    result.push(start_i);
                    result.push(end_i);
                    // console_log!("{}: [{}..{}] \"{}\"", i, start_i, end_i, m.as_str());
                    position = m.end();
                } else {
                    // console_log!("_");
                    // indexes.push(-1);
                    // indexes.push(-1);
                }
            }
            // result.append(&mut indexes);
            // console_log!("");
            for cap in caps.iter() {
                // console_log!("iterate {:?}", cap);
            }
        } else {
            // console_log!("no match");
            position = text.len();
        }
    }
    // let r = vec!["tmp"];
    result.into_iter().map(|x| JsValue::from(x as i32)).collect()
}
