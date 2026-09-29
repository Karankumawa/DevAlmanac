// Cheatsheets and Quick Reference Data (Inspired by CodeWithHarry & GoalKicker)

export const cheatsheetsData = [
  {
    language: 'Python',
    slug: 'python',
    icon: 'python',
    color: '#38bdf8',
    category: 'General & Systems',
    version: 'Python 3.12+',
    description: 'Essential Python syntax, list slicing, dictionary operations, file I/O, and async patterns.',
    sections: [
      {
        title: 'Basic Syntax & Data Types',
        items: [
          { name: 'Variable Binding', code: 'x = 42\nname = "DevAlmanac"\nis_active = True', desc: 'Dynamically typed heap PyObjects' },
          { name: 'Type Hinting', code: 'def greet(name: str, count: int = 1) -> list[str]:\n    return [f"Hello {name}"] * count', desc: 'PEP 484 static typing' },
          { name: 'F-Strings', code: 'pi = 3.14159\nprint(f"Pi: {pi:.2f} | Hex: {255:#x}")', desc: 'Formatted string literals' },
        ],
      },
      {
        title: 'Collections & Slicing Idioms',
        items: [
          { name: 'List Slicing [start:stop:step]', code: 'nums = [0, 1, 2, 3, 4, 5]\nreversed_nums = nums[::-1]\nevens = nums[::2]', desc: 'O(k) shallow copy slicing' },
          { name: 'List / Dict Comprehensions', code: 'squares = [x**2 for x in range(10) if x % 2 == 0]\nlookup = {x: x**2 for x in range(5)}', desc: 'Concise collection generation' },
          { name: 'Dictionary Merging', code: 'defaults = {"host": "localhost", "port": 8000}\noverride = {"port": 5000}\nconfig = defaults | override # Python 3.9+', desc: 'Dictionary union operator' },
        ],
      },
      {
        title: 'Memory & Asynchronous Concurrency',
        items: [
          { name: 'Generator Expressions', code: 'gen = (x**2 for x in range(1_000_000))\nfirst = next(gen)', desc: 'Constant O(1) space lazy streaming' },
          { name: 'Asyncio Coroutine', code: 'import asyncio\n\nasync def fetch():\n    await asyncio.sleep(0.5)\n    return "data"\n\nres = asyncio.run(fetch())', desc: 'Non-blocking co-operative multitasking' },
        ],
      },
    ],
  },
  {
    language: 'C Language',
    slug: 'c-programming',
    icon: 'terminal',
    color: '#a78bfa',
    category: 'Low-Level Systems',
    version: 'C99 / C11 / C17',
    description: 'Pointer mechanics, memory allocation, struct padding, format specifiers, and POSIX headers.',
    sections: [
      {
        title: 'Pointer Mechanics & Addresses',
        items: [
          { name: 'Declaration & Dereference', code: 'int val = 42;\nint *ptr = &val;  // Address-of operator\n*ptr = 100;       // Dereference and mutate', desc: 'Direct memory addressing' },
          { name: 'Pointer Arithmetic', code: 'int arr[3] = {10, 20, 30};\nint *p = arr;\np++; // Advances by sizeof(int) = 4 bytes', desc: 'Scales by sizeof(target_type)' },
          { name: 'Const Pointers', code: 'const int *p1;     // Data is constant\nint * const p2 = &x; // Pointer address is constant\nconst int * const p3 = &x; // Both constant', desc: 'Pointer constness rules' },
        ],
      },
      {
        title: 'Dynamic Memory Allocation',
        items: [
          { name: 'malloc & free', code: 'int *arr = (int*)malloc(n * sizeof(int));\nif (!arr) return -1; // Always check NULL!\nfree(arr);\narr = NULL; // Defend against dangling pointer', desc: 'Heap memory lifecycle' },
          { name: 'calloc & realloc', code: 'int *buf = (int*)calloc(n, sizeof(int)); // Zero-initialized\nbuf = (int*)realloc(buf, new_n * sizeof(int));', desc: 'Safe reallocation & zeroing' },
        ],
      },
      {
        title: 'Structs & Bit Fields',
        items: [
          { name: 'Optimal Struct Layout', code: 'struct Aligned {\n    uint64_t large; // 8 bytes\n    uint32_t med;   // 4 bytes\n    uint8_t small;  // 1 byte (3 padding)\n}; // 16 bytes total', desc: 'Sort by descending field size' },
        ],
      },
    ],
  },
  {
    language: 'Go (Golang)',
    slug: 'go',
    icon: 'zap',
    color: '#00add8',
    category: 'Cloud Native & Concurrency',
    version: 'Go 1.22+',
    description: 'Goroutines, channels, interfaces, slices, structs, defer, and context patterns.',
    sections: [
      {
        title: 'Concurrency & Channels',
        items: [
          { name: 'Goroutine & WaitGroup', code: 'var wg sync.WaitGroup\nwg.Add(1)\ngo func() {\n    defer wg.Done()\n    fmt.Println("Concurrent!")\n}()\nwg.Wait()', desc: 'Lightweight 2KB runtime threads' },
          { name: 'Buffered vs Unbuffered Channel', code: 'syncCh := make(chan int)     // Unbuffered: synchronous handoff\nbufCh  := make(chan int, 100) // Buffered: async queue', desc: 'CSP communication primitives' },
          { name: 'Select with Timeout', code: 'select {\ncase msg := <-ch:\n    fmt.Println(msg)\ncase <-time.After(2 * time.Second):\n    fmt.Println("Timed out!")\n}', desc: 'Multiplexing channel operations' },
        ],
      },
      {
        title: 'Slices & Error Handling',
        items: [
          { name: 'Slice Operations', code: 's := make([]int, 0, 10) // len=0, cap=10\ns = append(s, 1, 2, 3)\nsub := s[1:3] // Slice view into underlying array', desc: 'Pointer, length, and capacity header' },
          { name: 'Explicit Error Handling', code: 'val, err := doSomething()\nif err != nil {\n    return fmt.Errorf("operation failed: %w", err)\n}', desc: 'No exceptions; explicit sentinel checks' },
        ],
      },
    ],
  },
  {
    language: 'Rust',
    slug: 'rust',
    icon: 'shield',
    color: '#f97316',
    category: 'Systems & Safety',
    version: 'Rust 2021 Edition',
    description: 'Ownership rules, borrow checker, match expressions, Result/Option, and traits.',
    sections: [
      {
        title: 'Ownership & Borrowing',
        items: [
          { name: 'Move Semantics', code: 'let s1 = String::from("Rust");\nlet s2 = s1; // Ownership moved! s1 is now invalid', desc: 'Affine type system prevents double free' },
          { name: 'References & Aliasing Rule', code: 'let mut s = String::from("DevAlmanac");\nlet r1 = &s; // Immutable borrow\nlet r2 = &s; // Allowed: many immutable borrows\n// let r3 = &mut s; // ERROR: cannot borrow mutably while &s exists', desc: 'Many &T XOR single &mut T' },
        ],
      },
      {
        title: 'Pattern Matching & Enums',
        items: [
          { name: 'Option & Result Matching', code: 'match result {\n    Ok(val) => println!("Success: {val}"),\n    Err(err) => eprintln!("Error: {err}"),\n}\n\n// Or if-let shorthand\nif let Some(x) = opt {\n    println!("Found {x}");\n}', desc: 'Exhaustive compile-time safety' },
        ],
      },
    ],
  },
];
