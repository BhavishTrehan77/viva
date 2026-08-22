import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Play } from 'lucide-react';

export default function HoistingDemo() {
  const [results, setResults] = useState([]);

  const runDemo = () => {
    const logs = [];

    // 1. Variable Hoisting with var
    logs.push({
      type: 'var',
      title: 'Variable Hoisting (var)',
      code: `console.log(myVar);\nvar myVar = 'Hello';`,
      result: typeof myVar !== 'undefined' ? myVar : 'undefined', // It evaluates to undefined
      status: 'success',
      explanation: 'Variables declared with var are hoisted to the top of their scope and initialized with undefined.'
    });
    var myVar = 'Hello';

    // 2. Function Declaration Hoisting
    logs.push({
      type: 'function',
      title: 'Function Hoisting',
      code: `sayHello();\nfunction sayHello() {\n  return 'Hi there!';\n}`,
      result: sayHello(),
      status: 'success',
      explanation: 'Function declarations are fully hoisted, meaning you can call them before they appear in the code.'
    });

    function sayHello() {
      return 'Hi there!';
    }

    // 3. let/const Hoisting (Temporal Dead Zone)
    try {
      // We can't actually run this safely without crashing the app unless we use eval or new Function,
      // because React/Vite's bundler will often throw early. Let's simulate it safely or catch it.
      // Actually, if we just reference an undeclared variable it throws.
      // Let's use a dynamic approach to intentionally trigger the TDZ
      const tdzDemo = new Function(`
        try {
          return myLet;
          let myLet = 'Test';
        } catch(e) {
          return e.toString();
        }
      `);

      logs.push({
        type: 'let',
        title: 'Temporal Dead Zone (let/const)',
        code: `console.log(myLet);\nlet myLet = 'Test';`,
        result: tdzDemo(),
        status: 'error',
        explanation: 'Variables declared with let and const are hoisted but NOT initialized. Accessing them before declaration results in a ReferenceError due to the Temporal Dead Zone (TDZ).'
      });
    } catch (err) {
       // fallback if new Function fails
    }

    setResults(logs);
  };

  return (
    <div className="card hoisting-demo">
      <div className="card-header">
        <h2>JavaScript Hoisting Demo</h2>
        <button onClick={runDemo} className="btn primary">
          <Play size={16} /> Run Demo
        </button>
      </div>
      
      <div className="demo-results">
        {results.length === 0 && (
          <div className="empty-state">
            <p>Click "Run Demo" to see hoisting in action.</p>
          </div>
        )}
        
        {results.map((log, index) => (
          <div key={index} className={`log-entry ${log.status}`}>
            <div className="log-header">
              <h3>{log.title}</h3>
              {log.status === 'success' ? <CheckCircle2 className="icon-success" /> : <AlertCircle className="icon-error" />}
            </div>
            <pre className="code-block">
              <code>{log.code}</code>
            </pre>
            <div className="log-output">
              <strong>Output: </strong> 
              <span className={log.status === 'error' ? 'text-error' : 'text-success'}>
                {log.result}
              </span>
            </div>
            <p className="log-explanation">{log.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
