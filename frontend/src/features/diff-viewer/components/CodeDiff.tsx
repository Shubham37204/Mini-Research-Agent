import React from 'react';
import { DiffEditor } from '@monaco-editor/react';

interface CodeDiffProps {
  original: string;
  modified: string;
  language?: string;
}

export const CodeDiff = ({ original, modified, language = 'python' }: CodeDiffProps) => {
  return (
    <div className="h-[600px] border border-border rounded-lg overflow-hidden bg-zinc-950">
      <DiffEditor
        original={original}
        modified={modified}
        language={language}
        theme="vs-dark"
        options={{
          renderSideBySide: true,
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: 'on',
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
};
