import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';
import JSZip from 'jszip';
import styles from './styles.module.css';

type TreeNode = {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: TreeNode[];
};

type Manifest = {
  root: string;
  files: { path: string }[];
  tree: TreeNode;
};

type ExamplesExplorerProps = {
  path?: string;
  title?: string;
  showDownloadAll?: boolean;
  id?: string;
  fileQueryParam?: string;
};

const DEFAULT_TITLE = 'Examples';

function normalizePath(input?: string) {
  if (!input) {
    return '';
  }
  return input.replace(/^\/+|\/+$/g, '');
}

function findNode(root: TreeNode, path: string) {
  if (!path) {
    return root;
  }
  const parts = path.split('/');
  let current: TreeNode | undefined = root;
  for (const part of parts) {
    if (!current?.children) {
      return undefined;
    }
    current = current.children.find((child) => child.name === part);
  }
  return current;
}

function collectFiles(node?: TreeNode) {
  if (!node) {
    return [] as string[];
  }
  if (node.type === 'file') {
    return [node.path];
  }
  return (node.children ?? []).flatMap(collectFiles);
}

function getLanguageFromPath(filePath: string) {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'robot':
    case 'resource':
      return 'robotframework';
    case 'py':
      return 'python';
    case 'js':
    case 'mjs':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    case 'md':
    case 'mdx':
      return 'markdown';
    default:
      return 'plaintext';
  }
}

export default function ExamplesExplorer({
  path,
  title = DEFAULT_TITLE,
  showDownloadAll = true,
  id,
  fileQueryParam = 'file',
}: ExamplesExplorerProps): ReactNode {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isTreeCollapsed, setIsTreeCollapsed] = useState(false);
  const [treeWidth, setTreeWidth] = useState(240);
  const isResizing = useRef(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const baseExamplesUrl = useBaseUrl('/examples');
  const grammarUrl = useBaseUrl('/grammars/robotframework.tmLanguage.json');
  const { colorMode } = useColorMode();
  const editorTheme = colorMode === 'dark' ? 'vs-dark' : 'vs';
  const { search, hash } = useLocation();
  const normalizedPath = useMemo(() => normalizePath(path), [path]);
  const robotGrammarConfigured = useRef(false);

  useEffect(() => {
    let isMounted = true;
    fetch(`${baseExamplesUrl}/manifest.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Manifest not found'))))
      .then((data) => {
        if (isMounted) {
          setManifest(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [baseExamplesUrl]);

  const currentNode = useMemo(() => {
    if (!manifest) {
      return undefined;
    }
    return findNode(manifest.tree, normalizedPath);
  }, [manifest, normalizedPath]);

  const requestedFile = useMemo(() => {
    const searchParams = search ? new URLSearchParams(search) : null;
    const hashValue = hash?.startsWith('#') ? hash.slice(1) : hash;
    const hashQuery = hashValue?.includes('?') ? hashValue.split('?')[1] : '';
    const hashParams = hashQuery ? new URLSearchParams(hashQuery) : null;
    return (
      hashParams?.get(fileQueryParam) ??
      searchParams?.get(fileQueryParam) ??
      null
    );
  }, [search, hash, fileQueryParam]);

  useEffect(() => {
    if (!id || !hash) {
      return;
    }
    const hashValue = hash.startsWith('#') ? hash.slice(1) : hash;
    const [hashId] = hashValue.split('?');
    if (hashId === id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [hash, id]);

  useEffect(() => {
    if (!currentNode) {
      return;
    }
    const files = collectFiles(currentNode);
    if (requestedFile) {
      const match = files.find((file) =>
        file.endsWith(`/${requestedFile}`) || file === requestedFile
      );
      if (match) {
        setSelectedPath(match);
        return;
      }
    }
    if (currentNode.type === 'file') {
      setSelectedPath(currentNode.path);
      return;
    }
    const firstFile = files[0];
    setSelectedPath(firstFile ?? null);
  }, [currentNode, requestedFile]);

  useEffect(() => {
    if (!selectedPath) {
      setFileContent('');
      return;
    }
    fetch(`${baseExamplesUrl}/${selectedPath}`)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error('File not found'))))
      .then((data) => setFileContent(data))
      .catch((err) => setFileContent(`Failed to load file: ${err.message}`));
  }, [baseExamplesUrl, selectedPath]);

  const filesForDownload = useMemo(() => collectFiles(currentNode), [currentNode]);

  const downloadZip = useCallback(
    async (filePaths: string[], zipName: string) => {
      if (!filePaths.length) {
        return;
      }
      const zip = new JSZip();
      await Promise.all(
        filePaths.map(async (filePath) => {
          const response = await fetch(`${baseExamplesUrl}/${filePath}`);
          const data = await response.arrayBuffer();
          zip.file(filePath, data);
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = zipName;
      link.click();
      URL.revokeObjectURL(url);
    },
    [baseExamplesUrl]
  );

  const onResizeStart = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    isResizing.current = true;
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      if (!isResizing.current || !contentRef.current) {
        return;
      }
      const bounds = contentRef.current.getBoundingClientRect();
      const min = 0;
      const max = Math.min(480, bounds.width - 320);
      const next = Math.min(Math.max(event.clientX - bounds.left, min), max);
      setTreeWidth(next);
    };

    const handleUp = () => {
      isResizing.current = false;
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  const configureRobotFramework = useCallback(
    async (monaco: typeof import('monaco-editor')) => {
      if (robotGrammarConfigured.current) {
        return;
      }
      robotGrammarConfigured.current = true;

      if (!monaco.languages.getLanguages().some((lang) => lang.id === 'robotframework')) {
        monaco.languages.register({
          id: 'robotframework',
          extensions: ['.robot', '.resource'],
          aliases: ['Robot Framework', 'robotframework'],
        });
      }

      const registerFallback = () => {
        monaco.languages.setMonarchTokensProvider('robotframework', {
          tokenizer: {
            root: [
              [/^\*{3}.+\*{3}$/u, 'keyword'],
              [/^\s*#.*$/u, 'comment'],
              [/\$\{[^}]+\}/u, 'variable'],
              [/@\{[^}]+\}/u, 'variable'],
              [/&\{[^}]+\}/u, 'variable'],
              [/\[.+?\]/u, 'annotation'],
            ],
          },
        });
      };

      try {
        const grammarResponse = await fetch(grammarUrl);
        if (!grammarResponse.ok) {
          registerFallback();
          return;
        }
        const grammarContent = await grammarResponse.text();
        const [{ Registry }, { wireTmGrammars }, { loadWASM }] = await Promise.all([
          import('monaco-textmate'),
          import('monaco-editor-textmate'),
          import('onigasm'),
        ]);
        const onigasmResponse = await fetch('https://unpkg.com/onigasm@2.2.5/lib/onigasm.wasm');
        if (onigasmResponse.ok) {
          const wasm = await onigasmResponse.arrayBuffer();
          await loadWASM(wasm);
        }

        const registry = new Registry({
          getGrammarDefinition: async () => ({
            format: 'json',
            content: grammarContent,
          }),
        });

        const grammars = new Map();
        grammars.set('robotframework', 'source.robotframework');
        await wireTmGrammars(monaco, registry, grammars);
      } catch (err) {
        registerFallback();
      }
    },
    [grammarUrl]
  );

  if (error) {
    return <div className={styles.error}>Examples could not be loaded: {error}</div>;
  }

  if (!manifest) {
    return <div className={styles.loading}>Loading examples...</div>;
  }

  if (!currentNode) {
    return <div className={styles.error}>No examples found for path: {normalizedPath}</div>;
  }

  return (
    <section className={styles.container} id={id}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => setIsTreeCollapsed((prev) => !prev)}
          >
            {isTreeCollapsed ? 'Show files' : 'Hide files'}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => downloadZip(filesForDownload, 'examples.zip')}
          >
            Download this section
          </button>
          {showDownloadAll ? (
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={() => downloadZip(collectFiles(manifest.tree), 'all-examples.zip')}
            >
              Download all examples
            </button>
          ) : null}
        </div>
      </div>
      <div
        ref={contentRef}
        className={styles.content}
        style={
          isTreeCollapsed
            ? { gridTemplateColumns: 'minmax(0, 1fr)' }
            : { ['--tree-width' as string]: `${treeWidth}px` }
        }
      >
        {!isTreeCollapsed ? (
          <div className={styles.treePane}>
            <TreeView node={currentNode} selectedPath={selectedPath} onSelect={setSelectedPath} />
          </div>
        ) : null}
        {!isTreeCollapsed ? (
          <div
            className={styles.splitter}
            role="separator"
            aria-orientation="vertical"
            onMouseDown={onResizeStart}
          />
        ) : null}
        <div className={styles.editorPane}>
          {selectedPath ? (
            <BrowserOnly fallback={<div className={styles.loading}>Loading editor...</div>}>
              {() => {
                const MonacoEditor = require('@monaco-editor/react').default;
                return (
                  <MonacoEditor
                    height="600px"
                    width="100%"
                    language={getLanguageFromPath(selectedPath)}
                    value={fileContent}
                    theme={editorTheme}
                    beforeMount={configureRobotFramework}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      wordWrap: 'on',
                      automaticLayout: true,
                    }}
                  />
                );
              }}
            </BrowserOnly>
          ) : (
            <div className={styles.empty}>Select a file to preview.</div>
          )}
        </div>
      </div>
    </section>
  );
}

type TreeViewProps = {
  node: TreeNode;
  selectedPath: string | null;
  onSelect: (path: string) => void;
};

function TreeView({ node, selectedPath, onSelect }: TreeViewProps) {
  if (node.type === 'file') {
    return (
      <button
        type="button"
        className={node.path === selectedPath ? styles.fileActive : styles.file}
        onClick={() => onSelect(node.path)}
      >
        {node.name}
      </button>
    );
  }

  return (
    <div className={styles.folder}>
      <div className={styles.folderLabel}>{node.name}</div>
      <div className={styles.folderChildren}>
        {(node.children ?? []).map((child) => (
          <TreeView
            key={child.path}
            node={child}
            selectedPath={selectedPath}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
