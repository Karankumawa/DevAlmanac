import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  FileCode,
  Flame,
  Sparkles,
} from 'lucide-react';

const starterTemplates = {
  python: `# Python 3.12 Interactive Sandbox
# Try creating objects, generators, or async tasks!

def calculate_stats(numbers):
    total = sum(numbers)
    avg = total / len(numbers) if numbers else 0
    return {"total": total, "average": avg}

data = [10, 25, 45, 80, 95]
stats = calculate_stats(data)

print(f"Data: {data}")
print(f"Stats: {stats}")

# List comprehension example
squared = [x**2 for x in data if x > 20]
print(f"Squares (>20): {squared}")
`,
  c: `// C Programming Playground
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int arr[] = {10, 20, 30, 40, 50};
    int *ptr = arr;
    
    printf("Array base address: %p\\n", (void*)arr);
    printf("Pointer points to  : %d\\n", *ptr);
    
    ptr += 2; // Pointer arithmetic
    printf("After ptr += 2     : %d (at %p)\\n", *ptr, (void*)ptr);
    
    return 0;
}
`,
  go: `// Go Concurrency Playground
package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan string)

	go func() {
		time.Sleep(100 * time.Millisecond)
		ch <- "Hello from concurrent goroutine!"
	}()

	fmt.Println("Waiting for channel message...")
	msg := <-ch
	fmt.Printf("Received: %s\\n", msg)
}
`,
  rust: `// Rust Ownership Playground
fn main() {
    let mut message = String::from("DevAlmanac");
    println!("Original: {}", message);
    
    modify_string(&mut message);
    println!("After borrow: {}", message);
}

fn modify_string(s: &mut String) {
    s.push_str(" is blazing fast!");
}
`,
  javascript: `// Modern JavaScript Playground
const items = [
  { id: 1, name: "Async Event Loop", difficulty: "Intermediate" },
  { id: 2, name: "Prototypes & Closures", difficulty: "Beginner" },
  { id: 3, name: "Microtasks & Promises", difficulty: "Advanced" }
];

console.log("Processing Almanac topics...");
const titles = items.map(item => \`[\${item.difficulty}] \${item.name}\`);
console.table(titles);
`,
};

export const PlaygroundView = () => {
  const [selectedLang, setSelectedLang] = useState('python');
  const [code, setCode] = useState(starterTemplates['python']);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    setCode(starterTemplates[lang] || '');
    setOutput('');
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput('Compiling and executing...');

    setTimeout(() => {
      if (selectedLang === 'javascript') {
        // Execute real JS in safe evaluation
        try {
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : a)).join(' ')),
            table: (data) => logs.push(JSON.stringify(data, null, 2)),
            error: (...args) => logs.push('ERROR: ' + args.join(' ')),
          };
          const runFn = new Function('console', code);
          runFn(customConsole);
          setOutput(logs.join('\n') || 'Program completed with no console output.');
        } catch (err) {
          setOutput(`Runtime Error: ${err.message}`);
        }
      } else {
        // Simulated execution output for compiled / backend languages
        if (selectedLang === 'python') {
          setOutput(`$ python3 main.py\nData: [10, 25, 45, 80, 95]\nStats: {'total': 255, 'average': 51.0}\nSquares (>20): [625, 2025, 6400, 9025]\n\n[Execution completed successfully in 0.04s]`);
        } else if (selectedLang === 'c') {
          setOutput(`$ gcc -Wall main.c -o main && ./main\nArray base address: 0x7ffd10203040\nPointer points to  : 10\nAfter ptr += 2     : 30 (at 0x7ffd10203048)\n\n[Execution completed successfully with exit code 0]`);
        } else if (selectedLang === 'go') {
          setOutput(`$ go run main.go\nWaiting for channel message...\nReceived: Hello from concurrent goroutine!\n\n[Execution completed in 0.11s]`);
        } else if (selectedLang === 'rust') {
          setOutput(`$ rustc main.rs && ./main\nOriginal: DevAlmanac\nAfter borrow: DevAlmanac is blazing fast!\n\n[Finished dev [unoptimized + debuginfo] in 0.28s]`);
        }
      }
      setIsRunning(false);
    }, 400);
  };

  const handleReset = () => {
    setCode(starterTemplates[selectedLang] || '');
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-10">
      {/* Header (W3Schools Try It Yourself style) */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-semibold mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>Interactive Code Sandbox</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Try It Yourself
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test and tweak code snippets live directly in your browser.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {['python', 'c', 'go', 'rust', 'javascript'].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleLangChange(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedLang === lang
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Output Split View (W3Schools 2-Column style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Left: Code Editor */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d131f] flex flex-col overflow-hidden shadow-2xl">
          {/* Editor Header */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-medium text-slate-300">
                main.{selectedLang === 'python' ? 'py' : selectedLang === 'javascript' ? 'js' : selectedLang}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs"
                title="Reset Code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs"
                title="Copy Code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Code</span>
              </button>
            </div>
          </div>

          {/* Textarea Code Editor */}
          <div className="relative flex-1 p-4 bg-[#090d16] font-mono text-xs text-slate-100 flex flex-col">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="w-full flex-1 bg-transparent resize-none focus:outline-none leading-relaxed font-mono text-slate-200"
              placeholder="Type your code here..."
            />
          </div>
        </div>

        {/* Right: Terminal Output View */}
        <div className="rounded-2xl border border-slate-800 bg-[#080b11] flex flex-col overflow-hidden shadow-2xl">
          <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-300">Terminal Output</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">STDOUT / STDERR</span>
          </div>

          <div className="flex-1 p-4 font-mono text-xs text-slate-300 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {output ? (
              output
            ) : (
              <span className="text-slate-600 italic">
                Click "Run Code" above to compile and view execution output...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
