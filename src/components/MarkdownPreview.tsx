import { Box, Link } from '@mui/material';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function getSummaryMarkdown(markdown: string) {
	return (
		markdown
			.split(/\n\s*\n/)
			.map(block => block.trim())
			.find(Boolean) ?? ''
	);
}

export const MarkdownPreview = memo(function MarkdownPreview({ summary = false, value }: { summary?: boolean, value: string }) {
	const content = summary ? getSummaryMarkdown(value) : value;

	return (
		<Box
			sx={{
				'& h1': {
					typography: 'h4',
					mb: 2,
					mt: 0,
				},
				'& h2': {
					typography: 'h5',
					mb: 1.5,
					mt: 3,
				},
				'& h3': {
					typography: 'h6',
					mb: 1,
					mt: 2.5,
				},
				'& p': {
					typography: 'body1',
					lineHeight: 1.7,
					mb: 1.5,
				},
				'& ul, & ol': {
					pl: 3,
					mb: 2,
				},
				'& li': {
					mb: 0.5,
				},
				'& pre': {
					p: 2,
					borderRadius: 2,
					overflowX: 'auto',
					fontSize: 14,
				},
				'& code': {
					fontFamily: 'monospace',
					fontSize: '0.95em',
				},
				'& :not(pre) > code': {
					display: 'inline-block',
					px: 0.75,
					py: 0.25,
					borderRadius: 1,
					bgcolor: 'action.hover',
				},
				'& blockquote': {
					borderLeft: '4px solid',
					borderColor: 'divider',
					pl: 2,
					ml: 0,
					color: 'text.secondary',
				},
				'& a': {
					color: 'primary.main',
				},
				'& hr': {
					border: 0,
					borderTop: '1px solid',
					borderColor: 'divider',
					my: 3,
				},
				'& table': {
					width: '100%',
					borderCollapse: 'collapse',
					mb: 2,
				},
				'& th, & td': {
					border: '1px solid',
					borderColor: 'divider',
					p: 1,
					textAlign: 'left',
				},
			}}
		>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					h1({ children }) {
						if (summary) {
							return <p>{children}</p>;
						}

						return <h1>{children}</h1>;
					},
					h2({ children }) {
						if (summary) {
							return <p>{children}</p>;
						}

						return <h2>{children}</h2>;
					},
					pre({ children }) {
						if (summary) {
							return <p>{children}</p>;
						}

						return <pre>{children}</pre>;
					},
					// @ts-expect-error: Property inline does not exist on type (but it does)
					code({ inline, className, children }) {
						const match = /language-(\w+)/.exec(className || '');

						return !inline && match ? (
							<SyntaxHighlighter
								style={oneDark}
								language={match[1]}
								PreTag="div"
								customStyle={{
									paddingLeft: '16px',
								}}
							>
								{String(children).replace(/\n$/, '')}
							</SyntaxHighlighter>
						) : (
							<code className={className}>{children}</code>
						);
					},
					a: ({ href, children }) => (
						<Link href={href} target="_blank" rel="noopener noreferrer">
							{children}
						</Link>
					),
				}}
			>
				{content || '_Commencez à écrire pour voir le résultat._'}
			</ReactMarkdown>
		</Box>
	);
});
