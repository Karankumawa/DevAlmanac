import Prism from 'prismjs';

// Import core languages
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

export const highlightCode = (code, language = 'javascript') => {
  const langKey = language.toLowerCase();
  const grammar = Prism.languages[langKey] || Prism.languages.javascript || Prism.languages.clike;
  try {
    return Prism.highlight(code, grammar, langKey);
  } catch (err) {
    console.warn(`Prism highlighting failed for ${language}:`, err);
    return code;
  }
};

export default Prism;
