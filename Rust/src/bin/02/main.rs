mod string_to_int_parser;

fn main() {
    let file_path = "src/bin/02/input.txt";

    let numbers_of_numbers = string_to_int_parser::read_to_integers(file_path);
    let mut sum = 0;
    for line_of_numbers in numbers_of_numbers.iter() {
        let initial_ordering = line_of_numbers[0].cmp(&line_of_numbers[1]);
        let bb = line_of_numbers.windows(2).all(|pair| {
            let a = pair[0];
            let b = pair[1];
            let distance = (a - b).abs();

            if distance > 3 {
                return false;
            }
            let abba = a.cmp(&b);
            if abba == std::cmp::Ordering::Equal {
                return false;
            }
            if abba != initial_ordering {
                return false;
            }
            return true;
        });
        if bb {
            sum += 1;
            //println!("{:?} is a BB", line_of_numbers);
        } else {
            // println!("{:?} is not a BB", line_of_numbers);
        }
    }
    println!("{sum:?}");
    //  println!("{:?}", numbers_of_numbers.len());
}
