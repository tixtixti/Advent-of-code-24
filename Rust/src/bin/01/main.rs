use std::fs;

fn main() {
    let file_path = "src/bin/01/input.txt";

    match fs::read_to_string(file_path) {
        Ok(content) => {
            let mut first_numbers: Vec<i32> = Vec::new();
            let mut second_numbers: Vec<i32> = Vec::new();

            for line in content.lines() {
                let parts: Vec<&str> = line.split_whitespace().collect();
                let first_num = parts[0].parse::<i32>().unwrap();
                let second_num = parts[1].parse::<i32>().unwrap();
                first_numbers.push(first_num);
                second_numbers.push(second_num);
            }

            first_numbers.sort();
            second_numbers.sort();
            let mut summa: i32 = 0;
            for (first, second) in first_numbers.iter().zip(second_numbers.iter()) {
                let abs = (first - second).abs();
                summa = summa + abs;
            }
            println!("summa {}", summa); // part 1
        }
        Err(error) => {
            eprintln!("{}", error)
        }
    }
}
