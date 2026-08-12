const fs = require('fs');
let p = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/search/page.tsx';
let c = fs.readFileSync(p, 'utf8');

if (!c.includes('import Header from "../components/Header";')) {
  c = c.replace('import { useFetch } from "../lib/useFetch";', 'import { useFetch } from "../lib/useFetch";\nimport Header from "../components/Header";');
}

const headerRegex = /<header className=\{styles\.header\}>[\s\S]*?<\/header>/;

const searchBarReplacement = `<Header />
      <div className={styles.container} style={{ paddingTop: 24, paddingBottom: 0 }}>
        <form className={styles.searchBar} style={{ maxWidth: 800, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} role="search" onSubmit={submitSearch}>
          <label className={styles.searchField}>
            <span className={styles.iconWrap} aria-hidden="true">
              <iconify-icon icon="lucide:search" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Service"
              aria-label="Service"
            />
          </label>
          <label className={styles.searchField}>
            <span className={styles.iconWrap} aria-hidden="true">
              <iconify-icon icon="lucide:map-pin" />
            </span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Location"
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
              >
                <option value="Global">Global</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Cameroon">Cameroon</option>
              </select>
          </label>
          <button type="submit" className={\`\${styles.button} \${styles.buttonPrimary}\`}>
            Search
          </button>
        </form>
      </div>`;

c = c.replace(headerRegex, searchBarReplacement);

fs.writeFileSync(p, c);
