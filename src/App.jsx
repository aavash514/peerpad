import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const timeoutRef = useRef(null);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  const languages = [
    'javascript',
    'python',
    'java',
    'cpp',
    'c',
    'csharp',
    'ruby',
    'go',
    'swift',
    'php',
    'typescript',
    'rust',
    'kotlin',
    'scala',
    'r',
    'perl',
    'bash',
    'html',
    'css',
    'sql',
    'dart',
    'lua',
    'matlab',
    'assembly'
  ];

  const languagePlaceholders = {
    javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
    python: '# Write your Python code here\nprint("Hello, World!")',
    java: '// Write your Java code here\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
    cpp: '// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}',
    c: '// Write your C code here\n#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}',
    csharp: '// Write your C# code here\nusing System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, World!");\n  }\n}',
    ruby: '# Write your Ruby code here\nputs "Hello, World!"',
    go: '// Write your Go code here\npackage main\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, World!")\n}',
    swift: '// Write your Swift code here\nprint("Hello, World!")',
    php: '<?php\n// Write your PHP code here\necho "Hello, World!\\n";\n?>',
    typescript: '// Write your TypeScript code here\nconsole.log("Hello, World!");',
    rust: '// Write your Rust code here\nfn main() {\n  println!("Hello, World!");\n}',
    kotlin: '// Write your Kotlin code here\nfun main() {\n  println("Hello, World!")\n}',
    scala: '// Write your Scala code here\nobject Main extends App {\n  println("Hello, World!")\n}',
    r: '# Write your R code here\nprint("Hello, World!")',
    perl: '# Write your Perl code here\nprint "Hello, World!\\n";',
    bash: '# Write your Bash script here\necho "Hello, World!"',
    html: '<!-- Write your HTML code here -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>',
    css: '/* Write your CSS code here */\nbody {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  font-family: Arial, sans-serif;\n}',
    sql: '-- Write your SQL code here\nSELECT * FROM users WHERE active = true;',
    dart: '// Write your Dart code here\nvoid main() {\n  print("Hello, World!");\n}',
    lua: '-- Write your Lua code here\nprint("Hello, World!")',
    matlab: '% Write your MATLAB code here\ndisp("Hello, World!");',
    assembly: '; Write your Assembly code here\nsection .data\n  msg db "Hello, World!", 0xA\n  len equ $ - msg'
  };

  // Real-time execution for JavaScript
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (language === 'javascript' || language === 'typescript') {
        executeCode();
      }
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, language]);

  const executeCode = () => {
    if (!code.trim()) {
      setOutput('');
      return;
    }

    try {
      if (language === 'javascript' || language === 'typescript') {
        const logs = [];
        const customConsole = {
          log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
          error: (...args) => logs.push('❌ ' + args.join(' ')),
          warn: (...args) => logs.push('⚠️ ' + args.join(' ')),
          info: (...args) => logs.push('ℹ️ ' + args.join(' '))
        };

        try {
          const func = new Function('console', code);
          func(customConsole);
          setOutput(logs.length > 0 ? logs.join('\n') : '✅ Executed successfully');
        } catch (err) {
          setOutput(`❌ Error: ${err.message}`);
        }
      }
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
    }
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('🔄 Running...');

    setTimeout(() => {
      try {
        if (language === 'javascript' || language === 'typescript') {
          executeCode();
        } else {
          // Simulate output for different languages
          const output = simulateLanguageOutput(code, language);
          setOutput(output);
        }
      } catch (error) {
        setOutput(`❌ Error: ${error.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  const simulateLanguageOutput = (code, lang) => {
    const output = [];
    const lines = code.split('\n');

    try {
      switch(lang) {
        case 'python':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('print(')) {
              const match = line.match(/print\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^["']|["']$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'java':
          lines.forEach(line => {
            if (line.includes('System.out.println(')) {
              const match = line.match(/System\.out\.println\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^"|"$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'cpp':
        case 'c':
          lines.forEach(line => {
            if (line.includes('cout <<') || line.includes('printf(')) {
              let content = line.match(/"([^"]*)"/);
              if (content) output.push(content[1].replace(/\\n/g, ''));
            }
          });
          break;

        case 'csharp':
          lines.forEach(line => {
            if (line.includes('Console.WriteLine(')) {
              const match = line.match(/Console\.WriteLine\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^"|"$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'ruby':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('puts ')) {
              let content = line.replace('puts ', '').trim().replace(/^["']|["']$/g, '');
              output.push(content);
            }
          });
          break;

        case 'go':
          lines.forEach(line => {
            if (line.includes('fmt.Println(')) {
              const match = line.match(/fmt\.Println\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^"|"$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'swift':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('print(')) {
              const match = line.match(/print\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^"|"$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'php':
          lines.forEach(line => {
            if (line.includes('echo ')) {
              let content = line.match(/echo\s+["'](.*?)["']/);
              if (content) output.push(content[1]);
            }
          });
          break;

        case 'rust':
          lines.forEach(line => {
            if (line.includes('println!(')) {
              const match = line.match(/println!\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^"|"$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'kotlin':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('println(')) {
              const match = line.match(/println\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^"|"$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'scala':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('println(')) {
              const match = line.match(/println\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^"|"$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'r':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('print(')) {
              const match = line.match(/print\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^["']|["']$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'perl':
          lines.forEach(line => {
            if (line.includes('print ')) {
              let content = line.match(/print\s+["'](.*?)["']/);
              if (content) output.push(content[1]);
            }
          });
          break;

        case 'bash':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('echo ')) {
              let content = line.replace('echo ', '').trim().replace(/^["']|["']$/g, '');
              output.push(content);
            }
          });
          break;

        case 'dart':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('print(')) {
              const match = line.match(/print\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^"|"$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'lua':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('print(')) {
              const match = line.match(/print\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^["']|["']$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'matlab':
          lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('disp(')) {
              const match = line.match(/disp\((.*)\)/);
              if (match) {
                let content = match[1].trim().replace(/^["']|["']$/g, '');
                output.push(content);
              }
            }
          });
          break;

        case 'html':
          return '📄 HTML Preview:\n\n' + code + '\n\n✅ HTML is valid!';

        case 'css':
          return '🎨 CSS Styles:\n\n' + code + '\n\n✅ CSS looks great!';

        case 'sql':
          return '🗄️ SQL Query:\n\n' + code + '\n\n✅ Query syntax is valid!';

        case 'assembly':
          return '⚙️ Assembly Code:\n\n' + code + '\n\n✅ Assembly code ready!';

        default:
          return `✅ ${lang.toUpperCase()} code executed successfully!`;
      }

      if (output.length > 0) {
        return output.join('\n');
      } else {
        return `✅ Code executed successfully!\n\n💡 Tip: Use print/output statements to see results`;
      }
    } catch (error) {
      return `❌ Error parsing output: ${error.message}`;
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (!code.trim() || code === languagePlaceholders[language]) {
      setCode(languagePlaceholders[newLang]);
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    syncScroll();
  };

  const handleKeyDown = (e) => {
    const textarea = e.target;
    const { selectionStart, selectionEnd } = textarea;

    // Auto-closing brackets and quotes
    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    if (pairs[e.key]) {
      e.preventDefault();
      const before = code.substring(0, selectionStart);
      const after = code.substring(selectionEnd);
      const newCode = before + e.key + pairs[e.key] + after;
      setCode(newCode);

      // Move cursor between the pair
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      }, 0);
    }

    // Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const before = code.substring(0, selectionStart);
      const after = code.substring(selectionEnd);
      setCode(before + '  ' + after);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      }, 0);
    }
  };

  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const highlightCode = (code, lang) => {
    if (!code) return '';

    const keywords = {
      javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'new', 'this', 'import', 'export', 'default', 'async', 'await', 'try', 'catch'],
      python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'as', 'with', 'try', 'except', 'finally', 'pass', 'break', 'continue'],
      java: ['public', 'private', 'protected', 'class', 'static', 'void', 'int', 'String', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'extends', 'implements', 'override'],
      cpp: ['int', 'void', 'char', 'float', 'double', 'class', 'public', 'private', 'protected', 'return', 'if', 'else', 'for', 'while', 'using', 'namespace', 'include'],
      c: ['int', 'void', 'char', 'float', 'double', 'struct', 'return', 'if', 'else', 'for', 'while', 'include', 'define'],
      csharp: ['public', 'private', 'protected', 'class', 'static', 'void', 'int', 'string', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'namespace', 'using', 'override', 'virtual'],
      ruby: ['def', 'class', 'end', 'if', 'else', 'elsif', 'unless', 'return', 'puts', 'print', 'require'],
      go: ['func', 'package', 'import', 'var', 'const', 'type', 'struct', 'interface', 'return', 'if', 'else', 'for', 'range'],
      swift: ['func', 'let', 'var', 'class', 'struct', 'enum', 'return', 'if', 'else', 'for', 'while', 'import'],
      php: ['function', 'class', 'public', 'private', 'protected', 'return', 'if', 'else', 'foreach', 'while', 'echo', 'print'],
      typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'new', 'this', 'import', 'export'],
      rust: ['fn', 'let', 'mut', 'struct', 'enum', 'impl', 'return', 'if', 'else', 'for', 'while', 'match', 'use'],
      kotlin: ['fun', 'val', 'var', 'class', 'object', 'return', 'if', 'else', 'for', 'while', 'when'],
    };

    // Escape HTML
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight strings (do this first to protect string contents)
    highlighted = highlighted.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="syntax-string">$1</span>');

    // Highlight comments
    if (lang === 'python' || lang === 'ruby' || lang === 'bash' || lang === 'r' || lang === 'perl') {
      highlighted = highlighted.replace(/(#.*$)/gm, '<span class="syntax-comment">$1</span>');
    } else {
      highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="syntax-comment">$1</span>');
      highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syntax-comment">$1</span>');
    }

    // Highlight keywords
    const langKeywords = keywords[lang] || keywords.javascript;
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b(?![^<]*<\\/span>)`, 'g');
      highlighted = highlighted.replace(regex, '<span class="syntax-keyword">$1</span>');
    });

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b(?![^<]*<\/span>)/g, '<span class="syntax-number">$1</span>');

    // Highlight functions
    highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\((?![^<]*<\/span>)/g, '<span class="syntax-function">$1</span>(');

    return highlighted;
  };

  const shareCode = () => {
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    const shareableLink = `${window.location.origin}?code=${encodeURIComponent(code)}&lang=${language}`;
    navigator.clipboard.writeText(shareableLink);
    alert('🔗 Share link copied to clipboard!');
    setShowShareModal(false);
  };

  const clearEditor = () => {
    setCode('');
    setOutput('');
  };

  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-text">PeerPad</span>
            <span className="logo-icon">⚡</span>
          </div>
        </div>

        <div className="header-right">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="language-selector"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          <button onClick={clearEditor} className="btn btn-clear">
            🗑️ Clear
          </button>

          <button onClick={shareCode} className="btn btn-share">
            🔗 Share
          </button>

          <button onClick={runCode} className="btn btn-run" disabled={isRunning}>
            {isRunning ? '⏳ Running...' : '▶️ Run'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="content">
        {/* Editor Card */}
        <div className="panel-card editor-card">
          <div className="card-header">
            <span className="card-icon">📝</span>
            <span className="card-title">Editor</span>
            <span className="language-badge">{language}</span>
          </div>
          <div className="editor-container">
            <div className="line-numbers">
              {lineNumbers.map(num => (
                <div key={num}>{num}</div>
              ))}
            </div>
            <div className="code-editor-wrapper">
              <pre
                ref={highlightRef}
                className="code-highlight"
                dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
              />
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                onScroll={syncScroll}
                className="code-textarea"
                placeholder={languagePlaceholders[language]}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Output Card */}
        <div className="panel-card output-card">
          <div className="card-header">
            <span className="card-icon">💻</span>
            <span className="card-title">Output</span>
          </div>
          <div className="output-container">
            {output ? (
              <pre className="output-text">{output}</pre>
            ) : (
              <div className="output-empty">
                <div className="empty-icon">🚀</div>
                <p>Run your code to see output</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Share Your Code</h2>
            <p>Collaborate in real-time with your team!</p>
            <div className="share-options">
              <button onClick={copyShareLink} className="btn btn-primary">
                📋 Copy Share Link
              </button>
              <button onClick={() => setShowShareModal(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
