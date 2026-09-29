// Seed Curriculum Data for DevAlmanac
const curriculum = [
  // ==========================================
  // TRACK 1: PYTHON
  // ==========================================
  {
    track: {
      name: 'Python',
      slug: 'python',
      description: 'Master Python from internal object representations and memory semantics to asynchronous concurrency and metaprogramming.',
      icon: 'python',
      color: '#38bdf8', // Sky Blue
      order: 1,
      badgeText: 'Most Popular',
    },
    modules: [
      {
        title: 'Core Fundamentals & Memory Model',
        slug: 'core-fundamentals',
        difficulty: 'Beginner',
        order: 1,
        description: 'Understand Python variable binding, mutability, pass-by-assignment, and reference counting.',
        lessons: [
          {
            title: 'Variable Binding, Mutability, and Memory References',
            slug: 'variable-binding-and-memory',
            estimatedReadTime: 7,
            order: 1,
            overview: 'In Python, variables are not memory containers like in C; they are pointers or labels bound to heap-allocated PyObjects. Understanding the distinction between mutable and immutable types is essential to avoid insidious runtime bugs.',
            content: `## The PyObject Philosophy

In C, declaring \`int x = 42;\` allocates 4 bytes on the stack and places the binary representation of \`42\` directly inside that memory slot.

In Python, everything is an object dynamically allocated on the heap, represented by a \`PyObject\` struct:

\`\`\`c
typedef struct _object {
    _PyObject_HEAD_EXTRA
    Py_ssize_t ob_refcnt;
    struct _typeobject *ob_type;
} PyObject;
\`\`\`

When you execute \`x = 42\`:
1. Python creates a \`PyLongObject\` at a specific heap address.
2. The reference count \`ob_refcnt\` is initialized or incremented.
3. The name \`x\` in the local namespace dictionary is mapped to that memory address.

### The Identity vs. Equality Conundrum

* \`==\` checks for **value equality** (calls \`__eq__\`).
* \`is\` checks for **pointer identity** (compares memory addresses \`id(a) == id(b)\`).

Python pre-allocates small integers in the range \`[-5, 256]\` inside a global lookup cache (interning). This is why \`250 is 250\` evaluates to \`True\`, whereas \`1000 is 1000\` might be \`False\` outside identical code objects.

### Visual Memory Layout

\`\`\`
  Variable Name (Namespace)           Heap Memory (PyObject)
  +--------------+                    +-------------------------+
  |      a       | --------------->   | PyObject (Type: int)    |
  +--------------+                    | Address: 0x7ffd91a0     |
                                      | Value: 100              |
  +--------------+                    | ob_refcnt: 2            |
  |      b       | --------------->   +-------------------------+
  +--------------+
\`\`\`

### Pass-by-Assignment

Python passes arguments via **Call by Sharing** (also known as *pass-by-assignment*). If you pass a mutable object like a \`list\` or \`dict\` into a function, in-place modifications reflect globally across all aliases holding that reference.
`,
            codeSnippets: [
              {
                fileName: 'memory_model.py',
                language: 'python',
                code: `import sys

# 1. Understanding Name Binding & Identity
x = [1, 2, 3]
y = x          # y references the exact same list object in memory
z = [1, 2, 3]  # z creates an independent list with identical contents

print(f"x == y: {x == y}")  # True (equal values)
print(f"x is y: {x is y}")  # True (same memory id)
print(f"x is z: {x is z}")  # False (different objects)

# 2. Mutating through an alias
y.append(4)
print(f"x after mutating y: {x}") # [1, 2, 3, 4]

# 3. Inspecting reference counts
print(f"Ref count for x: {sys.getrefcount(x) - 1}") # Notice alias tracking
`,
                explanation: 'Assigning y = x copies the memory reference, not the underlying array. Any mutating operation on y modifies the shared heap instance.',
                simulatedOutput: `x == y: True
x is y: True
x is z: False
x after mutating y: [1, 2, 3, 4]
Ref count for x: 2`,
                annotations: [
                  { line: 5, note: 'Creates a list PyObject; "x" points to its heap address.', tag: 'Memory' },
                  { line: 6, note: 'Copies pointer without cloning elements (shallow reference).', tag: 'Reference' },
                  { line: 10, note: '"is" operator compares id(x) == id(y) in O(1) time.', tag: 'Performance' },
                  { line: 14, note: 'In-place mutation via list.append() alters the shared buffer.', tag: 'Mutation' },
                ],
              },
            ],
            commonPitfalls: [
              'Using mutable default arguments (e.g. def append_to(item, target=[]):) creates a singleton list shared across every function invocation.',
              'Assuming "is" is equivalent to "==" for string and integer comparisons beyond interned boundaries.',
              'Shallow copying lists containing nested lists (e.g., matrix.copy() or matrix[:]) leaves nested items aliased.',
            ],
            practiceChallenge: {
              problem: 'Fix the dangerous accumulator function so that calling `add_event("login")` multiple times does not append events to previous calls unless explicitly passed a target history list.',
              hints: [
                'Do not use target=[] in the function signature.',
                'Use None as the default sentinel value.',
                'Initialize a fresh list inside the function body if target is None.',
              ],
              starterCode: `def add_event(event_name, history=[]):
    history.append(event_name)
    return history`,
              solution: `def add_event(event_name, history=None):
    if history is None:
        history = []
    history.append(event_name)
    return history`,
              solutionExplanation: 'Default arguments are evaluated once when the function definition is executed at module import, not at runtime call time. Sentinel pattern with None guarantees a brand new list allocation per independent call.',
            },
          },
          {
            title: 'List Comprehensions, Generators, and Memory Efficiency',
            slug: 'generators-and-iterators',
            estimatedReadTime: 8,
            order: 2,
            overview: 'Learn the architectural differences between eager evaluations (lists) and lazy evaluations (generators). Discover how the iterator protocol works under the hood with __iter__ and __next__.',
            content: `## Eager vs Lazy Evaluation

When processing gigabytes of data or large collections, creating eager lists can quickly exhaust system RAM.

* **List Comprehension (\`[x for x in data]\`):** Allocates the entire sequence into contiguous memory immediately.
* **Generator Expression (\`(x for x in data)\`):** Allocates a small stateful generator frame that yields one element on-demand.

### The Iterator Protocol

An iterator is an object implementing two core dunder methods:
1. \`__iter__()\`: Returns the iterator object itself.
2. \`__next__()\`: Returns the next element in the sequence, or raises \`StopIteration\` when exhausted.

\`\`\`
+-------------------+              +--------------------+
|  Iterable Object  | --__iter__()--> |  Iterator Engine   |
| (e.g. list, file) |                 |  State: index = 0  |
+-------------------+                 +--------------------+
                                                |
                                          __next__()
                                                v
                                      Returns next value
                                      (or raises StopIteration)
\`\`\`
`,
            codeSnippets: [
              {
                fileName: 'lazy_stream.py',
                language: 'python',
                code: `import sys

# Eager memory allocation vs Lazy streaming
def eager_squares(n):
    return [i ** 2 for i in range(n)]

def lazy_squares(n):
    for i in range(n):
        yield i ** 2

N = 1_000_000
eager_result = eager_squares(N)
lazy_result = lazy_squares(N)

print(f"Eager list memory : {sys.getsizeof(eager_result):,} bytes")
print(f"Lazy generator memory: {sys.getsizeof(lazy_result):,} bytes")
print(f"Next 3 values: {[next(lazy_result) for _ in range(3)]}")
`,
                explanation: 'The generator allocates less than 200 bytes regardless of whether N is ten or ten billion, enabling constant O(1) space streaming.',
                simulatedOutput: `Eager list memory : 8,448,728 bytes
Lazy generator memory: 200 bytes
Next 3 values: [0, 1, 4]`,
                annotations: [
                  { line: 7, note: 'The "yield" keyword transforms this function into a stateful generator.', tag: 'Keyword' },
                  { line: 15, note: 'List allocates ~8.4MB for 1M integers.', tag: 'Memory' },
                  { line: 16, note: 'Generator maintains only the stack frame pointer and current index.', tag: 'Optimization' },
                ],
              },
            ],
            commonPitfalls: [
              'Attempting to iterate over a generator a second time after it has raised StopIteration (generators are single-pass).',
              'Using len() on a generator (generators do not know their length in advance).',
              'Forgetting that slicing a generator like gen[:5] fails; you must use itertools.islice.',
            ],
            practiceChallenge: {
              problem: 'Create a custom generator function `chunked_stream(iterable, chunk_size)` that takes any iterable and yields successive tuples of length `chunk_size`.',
              hints: [
                'Obtain an iterator from the iterable using iter().',
                'Use itertools.islice or a while loop with next().',
                'Break cleanly when StopIteration occurs.',
              ],
              starterCode: `def chunked_stream(iterable, chunk_size):
    # Your implementation here
    pass`,
              solution: `def chunked_stream(iterable, chunk_size):
    iterator = iter(iterable)
    while True:
        chunk = []
        for _ in range(chunk_size):
            try:
                chunk.append(next(iterator))
            except StopIteration:
                if chunk:
                    yield tuple(chunk)
                return
        yield tuple(chunk)`,
              solutionExplanation: 'By converting the input to an iterator via iter(), chunked_stream works uniformly over lists, generators, network streams, and file handles with minimal memory overhead.',
            },
          },
        ],
      },
      {
        title: 'Asynchronous Python & Concurrency',
        slug: 'async-and-concurrency',
        difficulty: 'Intermediate',
        order: 2,
        description: 'Deep dive into the asyncio event loop, coroutines, tasks, and non-blocking I/O.',
        lessons: [
          {
            title: 'The Asyncio Event Loop & Coroutine Scheduling',
            slug: 'asyncio-event-loop',
            estimatedReadTime: 9,
            order: 1,
            overview: 'Understand how Python achieves high-throughput concurrent I/O on a single thread using non-blocking epoll/kqueue system calls and co-operative multitasking.',
            content: `## Concurrency vs Parallelism in CPython

CPython features the **Global Interpreter Lock (GIL)**, a mutual exclusion lock preventing multiple native threads from executing Python bytecode simultaneously.

While CPU-bound tasks cannot scale across multiple OS threads with standard threading, **I/O-bound tasks** (network requests, database queries, file transfers) spend 99% of their latency waiting for external responses.

\`\`\`
Thread 1: [Async Task A] --wait for DB--> [Async Task B] --wait for HTTP--> [Task A Resumes]
           (Single OS thread multiplexing across thousands of sockets via epoll)
\`\`\`

### Anatomy of a Coroutine

When you declare \`async def fetch_data():\`, the return value is a coroutine object. It will not execute until it is scheduled on an active event loop using \`await\` or \`asyncio.create_task()\`.
`,
            codeSnippets: [
              {
                fileName: 'async_worker.py',
                language: 'python',
                code: `import asyncio
import time

async def worker(worker_id: int, delay: float):
    print(f"[Worker {worker_id}] Starting task (delay {delay}s)...")
    await asyncio.sleep(delay) # Non-blocking yield to event loop
    print(f"[Worker {worker_id}] Finished!")
    return f"Result from worker {worker_id}"

async def main():
    start = time.perf_counter()
    
    # Run 3 workers concurrently
    tasks = [
        worker(1, 0.5),
        worker(2, 0.3),
        worker(3, 0.2)
    ]
    results = await asyncio.gather(*tasks)
    
    elapsed = time.perf_counter() - start
    print(f"All finished in {elapsed:.2f}s | Results: {results}")

asyncio.run(main())
`,
                explanation: 'Instead of running sequentially (0.5 + 0.3 + 0.2 = 1.0s), asyncio.gather runs all three tasks concurrently in ~0.50s on a single thread.',
                simulatedOutput: `[Worker 1] Starting task (delay 0.5s)...
[Worker 2] Starting task (delay 0.3s)...
[Worker 3] Starting task (delay 0.2s)...
[Worker 3] Finished!
[Worker 2] Finished!
[Worker 1] Finished!
All finished in 0.51s | Results: ['Result from worker 1', 'Result from worker 2', 'Result from worker 3']`,
                annotations: [
                  { line: 6, note: 'Yields control back to the event loop so other coroutines can run.', tag: 'Concurrency' },
                  { line: 17, note: 'asyncio.gather schedules all coroutines concurrently and waits for completion.', tag: 'API' },
                  { line: 20, note: 'Total runtime matches the maximum task duration rather than the sum.', tag: 'Performance' },
                ],
              },
            ],
            commonPitfalls: [
              'Calling blocking synchronous code (like time.sleep() or requests.get()) inside an async function blocks the entire event loop.',
              'Forgetting to await a coroutine function (results in a RuntimeWarning: coroutine was never awaited).',
              'Creating tasks inside loops without retaining a strong reference (can cause garbage collector to destroy running task).',
            ],
            practiceChallenge: {
              problem: 'Write a timeout-protected concurrent fetcher `fetch_with_fallback(coro, timeout, default_value)` that returns `default_value` if the coroutine does not complete within `timeout` seconds.',
              hints: [
                'Look at asyncio.wait_for.',
                'Catch asyncio.TimeoutError.',
              ],
              starterCode: `import asyncio

async def fetch_with_fallback(coro, timeout: float, default_value):
    # Implement safe timeout with fallback
    pass`,
              solution: `import asyncio

async def fetch_with_fallback(coro, timeout: float, default_value):
    try:
        return await asyncio.wait_for(coro, timeout=timeout)
    except asyncio.TimeoutError:
        return default_value`,
              solutionExplanation: 'asyncio.wait_for cancels the underlying task upon timing out and raises TimeoutError, allowing graceful degradation to safe defaults.',
            },
          },
        ],
      },
      {
        title: 'Metaprogramming & Advanced Systems',
        slug: 'metaprogramming-and-systems',
        difficulty: 'Advanced',
        order: 3,
        description: 'Explore Python descriptors, metaclasses, decorators, and internal bytecode mechanics.',
        lessons: [
          {
            title: 'Descriptors, Attribute Lookups, and Metaclasses',
            slug: 'descriptors-and-metaclasses',
            estimatedReadTime: 10,
            order: 1,
            overview: 'Understand the core engine behind @property, classmethod, and ORMs like SQLAlchemy and Django: the Python Descriptor protocol and class construction with type.__new__.',
            content: `## How Python Resolves obj.attribute

When you evaluate \`obj.x\`, Python does NOT simply query \`obj.__dict__['x']\`. It adheres to a strict precedence order:

1. **Data Descriptors:** An object in \`type(obj).__dict__\` implementing both \`__get__\` and \`__set__\`.
2. **Instance Dictionary:** \`obj.__dict__['x']\`.
3. **Non-Data Descriptors:** An object implementing only \`__get__\` (like regular methods or functions).
4. **Class Dictionary:** \`type(obj).__dict__['x']\`.
5. **Base Classes:** MRO (Method Resolution Order) traversal via C3 Linearization.
6. **Fallback:** Calls \`__getattr__\`, or raises \`AttributeError\`.

\`\`\`
       +----------------------------+
       | Evaluate: instance.attr    |
       +----------------------------+
                     |
       Is it a Data Descriptor?
       (defines __get__ and __set__)
          /                 \\
       [Yes]                [No]
         |                    |
   Invoke __get__()     In instance.__dict__?
                           /           \\
                        [Yes]          [No]
                          |              |
                      Return value   Is it a Non-Data Descriptor?
                                        (e.g., standard method)
\`\`\`
`,
            codeSnippets: [
              {
                fileName: 'typed_descriptor.py',
                language: 'python',
                code: `class TypedField:
    """A reusable data descriptor enforcing strict type validation."""
    def __init__(self, expected_type):
        self.expected_type = expected_type
        self.storage_name = None

    def __set_name__(self, owner, name):
        # Automatically capture the attribute variable name
        self.storage_name = f"_{name}"

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.storage_name, None)

    def __set__(self, instance, value):
        if not isinstance(value, self.expected_type):
            raise TypeError(
                f"Expected {self.expected_type.__name__}, got {type(value).__name__}"
            )
        setattr(instance, self.storage_name, value)

class ServerConfig:
    host = TypedField(str)
    port = TypedField(int)

    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port

config = ServerConfig("127.0.0.1", 8080)
print(f"Server configured at {config.host}:{config.port}")
`,
                explanation: 'Descriptors eliminate repetitive getter/setter boilerplates while keeping validation logic modular and high performance.',
                simulatedOutput: `Server configured at 127.0.0.1:8080`,
                annotations: [
                  { line: 7, note: '__set_name__ is invoked automatically when the containing class is constructed.', tag: 'Lifecycle' },
                  { line: 16, note: '__set__ intercepts every assignment, turning "config.port = ..." into a verified transaction.', tag: 'Security' },
                ],
              },
            ],
            commonPitfalls: [
              'Storing per-instance data inside self inside the descriptor instead of on the target instance (leads to memory leaks and cross-instance data collisions).',
              'Confusing __getattr__ (invoked only when attribute lookup fails) with __getattribute__ (intercepts ALL lookups).',
            ],
            practiceChallenge: {
              problem: 'Build a descriptor `BoundedNumber(min_val, max_val)` that validates that an assigned integer is within the inclusive range [min_val, max_val]. Throw ValueError if out of bounds.',
              hints: [
                'Implement __set__(self, instance, value).',
                'Check min_val <= value <= max_val.',
              ],
              starterCode: `class BoundedNumber:
    def __init__(self, min_val, max_val):
        self.min_val = min_val
        self.max_val = max_val
        self.name = None

    def __set_name__(self, owner, name):
        self.name = f"_{name}"

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name, None)

    def __set__(self, instance, value):
        # Implement bounds check
        pass`,
              solution: `class BoundedNumber:
    def __init__(self, min_val, max_val):
        self.min_val = min_val
        self.max_val = max_val
        self.name = None

    def __set_name__(self, owner, name):
        self.name = f"_{name}"

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name, None)

    def __set__(self, instance, value):
        if not (self.min_val <= value <= self.max_val):
            raise ValueError(f"Value {value} out of bounds [{self.min_val}, {self.max_val}]")
        setattr(instance, self.name, value)`,
              solutionExplanation: 'By checking bounds before calling setattr, invalid assignments are rejected immediately without corrupting application state.',
            },
          },
        ],
      },
    ],
  },

  // ==========================================
  // TRACK 2: C PROGRAMMING
  // ==========================================
  {
    track: {
      name: 'C Systems Programming',
      slug: 'c-programming',
      description: 'Master low-level systems programming, manual memory management, pointer arithmetic, struct alignment, and OS system calls.',
      icon: 'terminal',
      color: '#a78bfa', // Purple / Violet
      order: 2,
      badgeText: 'Low Level & Systems',
    },
    modules: [
      {
        title: 'Pointers & Memory Architecture',
        slug: 'pointers-and-memory',
        difficulty: 'Beginner',
        order: 1,
        description: 'Understand stack vs heap, pointer arithmetic, dereferencing, and pointer-to-pointer semantics.',
        lessons: [
          {
            title: 'Pointer Arithmetic, Addresses, and Dereferencing',
            slug: 'pointer-arithmetic-and-addresses',
            estimatedReadTime: 9,
            order: 1,
            overview: 'In C, memory is a flat array of addressable bytes. A pointer is simply a variable holding an address. Pointer arithmetic scales automatically by sizeof(T).',
            content: `## Memory Layout of a C Program

When an ELF executable executes under Linux/Unix, its virtual address space is organized into segments:

\`\`\`
High Memory (0xFFFFFFFF)
+-----------------------------------+
|  Kernel Space Mapping             |
+-----------------------------------+
|  Stack (grows DOWNWARD)           |  <-- Local variables, return frames
|       |                           |
|       v                           |
|                                   |
|       ^                           |
|       |                           |
|  Heap (grows UPWARD)              |  <-- malloc(), calloc(), realloc()
+-----------------------------------+
|  BSS Segment                      |  <-- Uninitialized globals & statics
+-----------------------------------+
|  Data Segment                     |  <-- Initialized globals & constants
+-----------------------------------+
|  Text Segment (Code)              |  <-- Binary machine instructions (Read-Only)
+-----------------------------------+
Low Memory (0x00000000)
\`\`\`

### Pointer Arithmetic Scaling

If \`int *ptr\` is pointing to address \`0x1000\`, executing \`ptr + 1\` does **not** evaluate to \`0x1001\`. It evaluates to:

$$\\text{address} + 1 \\times \\text{sizeof}(\\text{int}) = 0\\text{x}1000 + 4 = 0\\text{x}1004$$

Pointer arithmetic is strictly typed and scales by the size of the target datatype.
`,
            codeSnippets: [
              {
                fileName: 'pointer_mechanics.c',
                language: 'c',
                code: `#include <stdio.h>
#include <stdint.h>

int main(void) {
    int arr[4] = {10, 20, 30, 40};
    int *ptr = arr; // Decays to pointer to first element

    printf("arr address      : %p\\n", (void*)arr);
    printf("ptr points to    : %p | Value: %d\\n", (void*)ptr, *ptr);

    // Pointer arithmetic
    ptr++; // Moves forward by sizeof(int) = 4 bytes
    printf("After ptr++      : %p | Value: %d\\n", (void*)ptr, *ptr);

    // Pointer difference (distance in elements)
    int *end_ptr = &arr[3];
    ptrdiff_t diff = end_ptr - arr;
    printf("Element distance : %td elements\\n", diff);

    return 0;
}
`,
                explanation: 'Arrays decay to pointers when passed to expressions. ptr++ advances by 4 bytes (on 32/64-bit systems where sizeof(int) == 4).',
                simulatedOutput: `arr address      : 0x7ffeefbff560
ptr points to    : 0x7ffeefbff560 | Value: 10
After ptr++      : 0x7ffeefbff564 | Value: 20
Element distance : 3 elements`,
                annotations: [
                  { line: 6, note: 'Array identifier "arr" decays into a pointer &arr[0].', tag: 'Decay' },
                  { line: 12, note: 'ptr++ increments the address by sizeof(int) = 4 bytes.', tag: 'Arithmetic' },
                  { line: 17, note: 'Pointer subtraction yields ptrdiff_t representing element count.', tag: 'Systems' },
                ],
              },
            ],
            commonPitfalls: [
              'Dereferencing an uninitialized or wild pointer (*p = 100 before malloc/initialization causes segmentation fault).',
              'Returning the address of a local stack variable from a function (dangling stack pointer after frame pops).',
              'Buffer overflows from unchecked pointer increments past array boundaries.',
            ],
            practiceChallenge: {
              problem: 'Implement an in-place string reversal function `void reverse_string(char *str)` using two pointers without allocating any secondary buffer.',
              hints: [
                'Find string length or advance one pointer to the null terminator minus one.',
                'Swap characters from opposite ends moving inwards until pointers cross.',
              ],
              starterCode: `void reverse_string(char *str) {
    // In-place pointer swap
}`,
              solution: `void reverse_string(char *str) {
    if (!str || !*str) return;
    char *start = str;
    char *end = str;
    while (*end) end++;
    end--; // Step back from '\\0'

    while (start < end) {
        char temp = *start;
        *start = *end;
        *end = temp;
        start++;
        end--;
    }
}`,
              solutionExplanation: 'Using two pointers moving inwards eliminates the need for dynamic heap allocations, achieving O(N) time and O(1) auxiliary space.',
            },
          },
        ],
      },
      {
        title: 'Dynamic Allocation & Struct Alignment',
        slug: 'dynamic-memory-and-structs',
        difficulty: 'Intermediate',
        order: 2,
        description: 'Master malloc, calloc, realloc, free, memory leaks, Valgrind, and hardware byte-padding.',
        lessons: [
          {
            title: 'Dynamic Memory Lifecycles & Struct Padding',
            slug: 'dynamic-memory-and-struct-padding',
            estimatedReadTime: 10,
            order: 1,
            overview: 'Understand heap fragmentation, double frees, use-after-free vulnerabilities, and how hardware architectures align structs on word boundaries.',
            content: `## Struct Padding & Memory Alignment

CPUs do not read memory one byte at a time; they fetch 32-bit or 64-bit words from memory bus lines. For performance, data types are aligned to addresses that are multiples of their size.

Consider this struct:

\`\`\`c
struct BadLayout {
    char a;      // 1 byte
    // 3 bytes padding inserted by compiler
    int b;       // 4 bytes
    char c;      // 1 byte
    // 3 bytes trailing padding to maintain 4-byte struct alignment
}; // Total: 12 bytes!
\`\`\`

Rearranging fields by descending size:

\`\`\`c
struct OptimalLayout {
    int b;       // 4 bytes
    char a;      // 1 byte
    char c;      // 1 byte
    // 2 bytes trailing padding
}; // Total: 8 bytes (33% memory savings!)
\`\`\`
`,
            codeSnippets: [
              {
                fileName: 'struct_alignment.c',
                language: 'c',
                code: `#include <stdio.h>
#include <stdlib.h>

struct Unaligned {
    char a;
    int b;
    char c;
};

struct Aligned {
    int b;
    char a;
    char c;
};

int main(void) {
    printf("sizeof(struct Unaligned): %zu bytes\\n", sizeof(struct Unaligned));
    printf("sizeof(struct Aligned)  : %zu bytes\\n", sizeof(struct Aligned));

    // Dynamic allocation with error verification
    int *buffer = (int*)malloc(1024 * sizeof(int));
    if (buffer == NULL) {
        perror("Allocation failed");
        return EXIT_FAILURE;
    }

    buffer[0] = 42;
    printf("Buffer allocated successfully at %p\\n", (void*)buffer);

    free(buffer);
    buffer = NULL; // Defend against dangling pointer / use-after-free
    return EXIT_SUCCESS;
}
`,
                explanation: 'Always set freed pointers to NULL to prevent use-after-free and double-free exploits.',
                simulatedOutput: `sizeof(struct Unaligned): 12 bytes
sizeof(struct Aligned)  : 8 bytes
Buffer allocated successfully at 0x7fa281405000`,
                annotations: [
                  { line: 17, note: 'Compiler inserts 3 bytes after char a and 3 bytes after char c.', tag: 'Padding' },
                  { line: 26, note: 'Always verify malloc return value != NULL before dereferencing.', tag: 'Safety' },
                  { line: 31, note: 'Setting freed pointers to NULL prevents catastrophic use-after-free bugs.', tag: 'Security' },
                ],
              },
            ],
            commonPitfalls: [
              'Calling free() twice on the same pointer (Double Free corruption).',
              'Memory Leaks: Losing the only reference pointer before calling free().',
              'Off-by-one string allocation: malloc(strlen(str)) forgets the +1 for the null terminator \\0.',
            ],
            practiceChallenge: {
              problem: 'Implement a safe dynamic integer vector initialization `int* create_zeroed_buffer(size_t count)` using calloc with allocation validation.',
              hints: [
                'calloc(count, size) zero-initializes memory.',
                'Return NULL if count == 0 or if allocation fails.',
              ],
              starterCode: `int* create_zeroed_buffer(size_t count) {
    // Implement safe zeroed allocation
}`,
              solution: `int* create_zeroed_buffer(size_t count) {
    if (count == 0) return NULL;
    int *buf = (int*)calloc(count, sizeof(int));
    if (!buf) {
        return NULL;
    }
    return buf;
}`,
              solutionExplanation: 'calloc guarantees that all bits are set to 0, preventing accidental reads of uninitialized stack or heap garbage.',
            },
          },
        ],
      },
    ],
  },

  // ==========================================
  // TRACK 3: GO (GOLANG)
  // ==========================================
  {
    track: {
      name: 'Go Systems & Services',
      slug: 'go',
      description: 'Master Go from goroutine CSP concurrency patterns and channel pipelines to interface composition and production microservices.',
      icon: 'zap',
      color: '#00add8', // Go Cyan
      order: 3,
      badgeText: 'Cloud Native',
    },
    modules: [
      {
        title: 'Goroutines, Channels & CSP',
        slug: 'concurrency-and-channels',
        difficulty: 'Intermediate',
        order: 1,
        description: 'Communicating Sequential Processes, buffered vs unbuffered channels, select statements, and race detection.',
        lessons: [
          {
            title: 'CSP Concurrency: Goroutines & Buffered Channels',
            slug: 'goroutines-and-channels',
            estimatedReadTime: 8,
            order: 1,
            overview: 'Go models concurrency through Communicating Sequential Processes (CSP). "Do not communicate by sharing memory; instead, share memory by communicating."',
            content: `## The Go Runtime M:N Scheduler

Unlike operating system threads which carry a ~1-2 MB stack, Go routines start with a lightweight **2 KB segmented stack** that grows dynamically.

The Go scheduler multiplexes **M** goroutines onto **N** OS threads across **P** logical processor contexts:

\`\`\`
+-------------------------------------------------------+
|                       Go Runtime                      |
|                                                       |
|  [Goroutine G1]   [Goroutine G2]   [Goroutine G3]     |
|         \\               |                /           |
|        (Local Run Queue assigned to Logical P)        |
|                         |                             |
|             [Logical Processor P]                     |
|                         |                             |
|               [OS Thread M]                           |
|                         |                             |
|               [Physical CPU Core]                     |
+-------------------------------------------------------+
\`\`\`

### Channels as Synchronization Primitives

* **Unbuffered Channel (\`make(chan T)\`):** Synchronous handoff. Sender blocks until receiver is ready.
* **Buffered Channel (\`make(chan T, cap)\`):** Asynchronous ring buffer. Sender only blocks when capacity is filled.
`,
            codeSnippets: [
              {
                fileName: 'pipeline.go',
                language: 'go',
                code: `package main

import (
	"fmt"
	"sync"
	"time"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		// Simulate computation
		time.Sleep(50 * time.Millisecond)
		results <- j * 2
	}
}

func main() {
	const numJobs = 6
	const numWorkers = 3

	jobs := make(chan int, numJobs)
	results := make(chan int, numJobs)
	var wg sync.WaitGroup

	// Spawn worker pool
	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	// Enqueue jobs
	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs) // Signal no more work

	wg.Wait()
	close(results)

	for r := range results {
		fmt.Printf("Received processed result: %d\\n", r)
	}
}
`,
                explanation: 'A classic Go worker pool demonstrating channel directionality (read-only <-chan and send-only chan<-) and sync.WaitGroup lifecycle management.',
                simulatedOutput: `Received processed result: 2
Received processed result: 4
Received processed result: 6
Received processed result: 8
Received processed result: 10
Received processed result: 12`,
                annotations: [
                  { line: 9, note: 'jobs <-chan int enforces compile-time read-only safety.', tag: 'Type Safety' },
                  { line: 10, note: 'defer wg.Done() guarantees cleanup even if panic occurs.', tag: 'Lifecycle' },
                  { line: 32, note: 'close(jobs) triggers the range loop in workers to terminate.', tag: 'Signaling' },
                ],
              },
            ],
            commonPitfalls: [
              'Sending on a closed channel causes an immediate runtime panic.',
              'Goroutine leaks: Spawning a goroutine that blocks indefinitely on an unread channel.',
              'Passing sync.WaitGroup or sync.Mutex by value instead of by pointer.',
            ],
            practiceChallenge: {
              problem: 'Implement a non-blocking channel receiver function `TryReceive(ch <-chan string) (string, bool)` that returns the value and true if ready, or ("", false) immediately without blocking.',
              hints: [
                'Use a select statement with a default branch.',
              ],
              starterCode: `func TryReceive(ch <-chan string) (string, bool) {
	// Implement non-blocking receive
	return "", false
}`,
              solution: `func TryReceive(ch <-chan string) (string, bool) {
	select {
	case val, ok := <-ch:
		if !ok {
			return "", false
		}
		return val, true
	default:
		return "", false
	}
}`,
              solutionExplanation: 'A select statement with a default block prevents the goroutine from suspending if the channel has no immediately available messages.',
            },
          },
        ],
      },
    ],
  },

  // ==========================================
  // TRACK 4: RUST
  // ==========================================
  {
    track: {
      name: 'Rust Systems Programming',
      slug: 'rust',
      description: 'Master memory safety without garbage collection through ownership, borrowing, lifetimes, pattern matching, and zero-cost abstractions.',
      icon: 'shield',
      color: '#f97316', // Rust Orange
      order: 4,
      badgeText: 'Memory Safe & Fast',
    },
    modules: [
      {
        title: 'Ownership, Borrowing & Lifetimes',
        slug: 'ownership-and-lifetimes',
        difficulty: 'Beginner',
        order: 1,
        description: 'The revolutionary borrow checker: affine type system, mutable vs immutable references, and compile-time drop mechanics.',
        lessons: [
          {
            title: 'The Trinity of Ownership Rules & Borrowing',
            slug: 'ownership-and-borrowing',
            estimatedReadTime: 9,
            order: 1,
            overview: 'Rust eliminates data races and memory leaks at compile time without a garbage collector by enforcing the three sacred rules of Ownership.',
            content: `## The Three Invariants of Rust Ownership

1. Each value in Rust has an **owner**.
2. There can only be **one owner at a time**.
3. When the owner goes **out of scope**, the value is automatically dropped via RAII (\`Drop::drop\`).

### The Aliasing XOR Mutability Rule

At any given point in program execution, you may have **either**:
* Exactly **one** mutable reference (\`&mut T\`), **OR**
* Any number of immutable references (\`&T\`).
* **Never both simultaneously!**

\`\`\`
       +---------------------------------------------+
       |           The Borrow Checker Law            |
       |                                             |
       |   Read Aliasing (Many &T)                   |
       |             XOR                             |
       |   Write Access (Single &mut T)              |
       +---------------------------------------------+
\`\`\`
`,
            codeSnippets: [
              {
                fileName: 'ownership.rs',
                language: 'rust',
                code: `fn main() {
    // 1. Ownership Transfer (Move semantics)
    let s1 = String::from("DevAlmanac");
    let s2 = s1; // Ownership moved to s2; s1 is now invalid!

    // println!("{}", s1); // COMPILE ERROR: value borrowed here after move

    // 2. Borrowing (References)
    let len = calculate_length(&s2);
    println!("String '{}' has length {}", s2, len);

    // 3. Mutable Borrowing
    let mut data = String::from("Rust");
    append_suffix(&mut data);
    println!("Mutated string: {}", data);
}

fn calculate_length(s: &String) -> usize {
    s.len() // s is a reference; caller retains ownership
}

fn append_suffix(s: &mut String) {
    s.push_str(" is blazing fast!");
}
`,
                explanation: 'Rust transfers ownership upon assignment for non-Copy heap types, eliminating double-free errors before machine code is even generated.',
                simulatedOutput: `String 'DevAlmanac' has length 10
Mutated string: Rust is blazing fast!`,
                annotations: [
                  { line: 4, note: 's1 pointer, capacity, and length are copied to s2; s1 is invalidated.', tag: 'Move' },
                  { line: 9, note: '&s2 passes an immutable reference without transferring ownership.', tag: 'Borrow' },
                  { line: 14, note: '&mut grants exclusive write permission for the scope of append_suffix.', tag: 'Mutation' },
                ],
              },
            ],
            commonPitfalls: [
              'Trying to access a variable after its value has been moved to another owner.',
              'Holding an immutable reference while attempting to modify the underlying collection (e.g. pushing to a vector while iterating over &vec[0]).',
              'Attempting to return a reference to a local variable created inside the function.',
            ],
            practiceChallenge: {
              problem: 'Fix the function signature for `longest` so that the Rust compiler understands that the returned string slice reference lives as long as the shorter of the two input references.',
              hints: [
                'Use generic lifetime parameters: <\'a>.',
                'Annotate x: &\'a str, y: &\'a str, and -> &\'a str.',
              ],
              starterCode: `fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() { x } else { y }
}`,
              solution: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}`,
              solutionExplanation: 'The lifetime annotation <\'a> informs the borrow checker that the output reference is valid for the intersection of the lifetimes of x and y.',
            },
          },
        ],
      },
    ],
  },
];

module.exports = curriculum;
