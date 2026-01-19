use std::collections::BTreeSet;

use glypher_wasm::crawler::{
    extract_glyphs_from_html,
    utils::{extract_glyphs_from_attributes, format_glyphs},
};

#[test]
fn test_extract_glyphs_from_html() {
    let html = r#"
            <html>
                <body>
                    <h1>Hello World</h1>
                    <p>Test 123</p>
                    <script>var x = "ignored";</script>
                </body>
            </html>
        "#;

    let glyphs = extract_glyphs_from_html(html);
    let expected_glyphs = BTreeSet::from([
        'H', 'e', 'l', 'o', 'W', 'o', 'r', 'l', 'd', 'T', 's', 't', '1', '2', '3',
    ]);
    assert_eq!(glyphs, expected_glyphs);
}

#[test]
fn test_extract_glyphs_from_attributes() {
    let html = r#"
        <html>
            <body>
                <img src="image.png" alt="Hello World">
            </body>
        </html>
    "#;
    let glyphs = extract_glyphs_from_attributes(html);
    let expected_glyphs = BTreeSet::from(['H', 'e', 'l', 'o', 'W', 'o', 'r', 'l', 'd']);
    assert_eq!(glyphs, expected_glyphs);
}

#[test]
fn test_extract_glyphs_from_title() {
    let html = r#"
        <html>
            <body>
                <h1 title="Hello World">Hello World</h1>
            </body>
        </html>
    "#;
    let glyphs = extract_glyphs_from_attributes(html);
    let expected_glyphs = BTreeSet::from(['H', 'e', 'l', 'o', 'W', 'o', 'r', 'l', 'd']);
    assert_eq!(glyphs, expected_glyphs);
}

#[test]
fn test_extract_glyphs_from_placeholder() {
    let html = r#"
        <html>
            <body>
                <input placeholder="Hello World">
            </body>
        </html>
    "#;
    let glyphs = extract_glyphs_from_attributes(html);
    let expected_glyphs = BTreeSet::from(['H', 'e', 'l', 'o', 'W', 'o', 'r', 'l', 'd']);
    assert_eq!(glyphs, expected_glyphs);
}

#[test]
fn test_extract_glyphs_from_aria_label() {
    let html = r#"
        <html>
            <body>
                <h1 aria-label="Hello World">Hello World</h1>
            </body>
        </html>
    "#;
    let glyphs = extract_glyphs_from_attributes(html);
    let expected_glyphs = BTreeSet::from(['H', 'e', 'l', 'o', 'W', 'o', 'r', 'l', 'd']);
    assert_eq!(glyphs, expected_glyphs);
}

#[test]
fn test_format_glyphs() {
    let glyphs = BTreeSet::from(['H', 'e', 'l', 'o', 'W', 'o', 'r', 'l', 'd']);
    let expected_string = "'H' (U+0048), 'W' (U+0057), 'd' (U+0064), 'e' (U+0065), 'l' (U+006C), 'o' (U+006F), 'r' (U+0072)";
    assert_eq!(format_glyphs(&glyphs), expected_string);
}
