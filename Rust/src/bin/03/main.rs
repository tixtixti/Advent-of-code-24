use regex::Regex;
use std::fs;
fn main() {
    let file_path = "src/bin/03/input.txt";
    let re = Regex::new(r"mul\((?P<num1>\d{1,3}),(?P<num2>\d{1,3})\)").unwrap();
    match fs::read_to_string(file_path) {
        Ok(content) => {
            let matches: Vec<_> = re.captures_iter(&content).collect();
            let sum: i32 = matches
                .iter()
                .map(|x| {
                    let a = x["num1"].parse::<i32>().unwrap();
                    let b = x["num2"].parse::<i32>().unwrap();
                    a * b
                })
                .sum();
            println!("{}", sum);

            // part 2
            let re2 =
                Regex::new(r"don't\(\)|do\(\)|mul\((?P<num1>\d{1,3}),(?P<num2>\d{1,3})\)").unwrap();
            let matches2: Vec<_> = re2.captures_iter(&content).collect();
            let mut is_counting = true;
            let sum2: i32 = matches2
                .iter()
                .map(|x| {
                    if &x[0] == "do()" {
                        is_counting = true;
                    } else if &x[0] == "don't()" {
                        is_counting = false;
                    } else {
                        if !is_counting {
                            return 0;
                        } else {
                            let a: i32 = x["num1"].parse::<i32>().unwrap();
                            let b: i32 = x["num2"].parse::<i32>().unwrap();
                            return a * b;
                        }
                    }
                    0
                })
                .sum();
            println!("{}", sum2);
        }

        Err(error) => {
            eprintln!("{}", error)
        }
    }
}
