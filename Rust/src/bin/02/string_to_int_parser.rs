use std::fs;

pub fn read_to_integers(file_path: &str) -> Vec<Vec<i32>> {
    let mut numbers_of_numbers: Vec<Vec<i32>> = Vec::new();
    match fs::read_to_string(file_path) {
        Ok(content) => {
            for line in content.lines() {
                let parts: Vec<&str> = line.split_whitespace().collect();
                let numbers: Vec<i32> = parts.iter().map(|i| i.parse::<i32>().unwrap()).collect();
                numbers_of_numbers.push(numbers);
            }
        }
        Err(error) => {
            eprintln!("{}", error)
        }
    }
    return numbers_of_numbers;
}
