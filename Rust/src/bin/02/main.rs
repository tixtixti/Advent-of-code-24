mod string_to_int_parser;

fn main() {
    let file_path = "src/bin/02/input.txt";

    let numbers_of_numbers = string_to_int_parser::read_to_integers(file_path);

    let sum: usize = numbers_of_numbers
        .iter()
        .filter(|line_of_numbers| {
            let initial_ordering = line_of_numbers[0].cmp(&line_of_numbers[1]);

            line_of_numbers.windows(2).all(|pair| {
                let (a, b) = (pair[0], pair[1]);
                let distance = (a - b).abs();
                distance <= 3 && a.cmp(&b) == initial_ordering && a != b
            })
        })
        .count();

    println!("{sum}");
}
