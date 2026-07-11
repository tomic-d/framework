import schema from '../addon.js';

/* Split raw DDL lines into the CREATE TABLE body (columns + table constraints),
   index lines and table clauses (partition by ...). Only names and flags are read
   here — pg itself gives the lines meaning (see describe). Keyword checks run on
   a copy with string literals stripped, so a default like 'primary key' cannot
   mislead them. */

const CONSTRAINTS = ['primary key', 'foreign key', 'constraint ', 'check ', 'check('];
const CLAUSES = ['partition by'];

schema.Fn('parse', function(lines)
{
	this.methods.name = (token) =>
	{
		return token.replace(/"/g, '').toLowerCase();
	};

	this.methods.group = (line) =>
	{
		return line.slice(line.indexOf('(') + 1, line.lastIndexOf(')')).split(',').map((name) => this.methods.name(name.trim()));
	};

	const parsed = { body: [], columns: [], indexes: [], clauses: [] };
	const primary = [];

	for(const raw of lines)
	{
		const line = raw.trim().replace(/\s+/g, ' ');

		if(!line)
		{
			continue;
		}

		const bare = line.toLowerCase().replace(/'[^']*'/g, '');

		if(CLAUSES.some((clause) => bare.startsWith(clause)))
		{
			parsed.clauses.push(line);
			continue;
		}

		if(bare.startsWith('index ') || bare.startsWith('index(') || bare.startsWith('unique ') || bare.startsWith('unique('))
		{
			parsed.indexes.push({
				unique: bare.startsWith('unique'),
				method: /^(?:index|unique) using (\w+)/.exec(bare)?.[1] || null,
				columns: this.methods.group(line)
			});
			continue;
		}

		parsed.body.push(line);

		if(CONSTRAINTS.some((constraint) => bare.startsWith(constraint)))
		{
			if(bare.startsWith('primary key'))
			{
				primary.push(...this.methods.group(line));
			}

			continue;
		}

		parsed.columns.push({
			name: this.methods.name(line.split(' ')[0]),
			line,
			array: bare.includes('[]'),
			primary: bare.includes('primary key'),
			auto: bare.includes('serial') || bare.includes('identity') || (bare.includes('primary key') && bare.includes('default'))
		});
	}

	for(const column of parsed.columns)
	{
		if(primary.includes(column.name))
		{
			column.primary = true;
		}
	}

	return parsed;
});
