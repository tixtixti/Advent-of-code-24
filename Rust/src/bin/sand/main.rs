fn main() {
    let ab: Vec<Vec<i32>> = [[1, 2, 3, 4].to_vec(), [5, 3, 2, 1].to_vec()].to_vec();
    ab.iter().for_each(|x| {
        let mut i = 0;
        while i < x.len() {
            let mut ba = x.clone();
            ba.remove(i);
            println!("{:?}", ba);
            i += 1;
        }
        println!()
    });
}
