mod string_to_int_parser;

fn check(line: &Vec<i32>) -> bool {
    let initial_ordering = line[0].cmp(&line[1]);

    line.windows(2).all(|pair| {
        let (a, b) = (pair[0], pair[1]);
        let distance = (a - b).abs();
        distance <= 3 && a.cmp(&b) == initial_ordering && a != b
    })
}

fn main() {
    let numbers_of_numbers = string_to_int_parser::read_to_integers("src/bin/02/input.txt");
    let sum: usize = numbers_of_numbers.clone().into_iter().filter(check).count();
    println!("{sum}");
    let mut sum2 = 0;

    numbers_of_numbers
        .into_iter()
        .filter(|line| !check(line))
        .collect::<Vec<_>>()
        .iter()
        .for_each(|line| {
            let mut i = 0;
            while i < line.len() {
                let mut ba = line.clone();
                ba.remove(i);
                if check(&ba) {
                    sum2 += 1;
                    break;
                }
                i += 1;
            }
        });

    println!("{:?}", sum2 + sum);
}
