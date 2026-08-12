const fs = require('fs');
let p = 'c:/Users/User-PC/Desktop/buolotman-main/buolotman-main/app/dashboard/company/quotes/page.tsx';
let content = fs.readFileSync(p, 'utf8');

// 1. Empty the MOCK_QUOTES array
content = content.replace(/const MOCK_QUOTES = \[[\s\S]*?\];/, "const MOCK_QUOTES: any[] = [];");

// 2. Replace the table with an empty state conditionally
const tableRegex = /<table[\s\S]*?<\/table>/;
const emptyState = `
              {MOCK_QUOTES.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
                  <iconify-icon icon="lucide:file-text" style={{ fontSize: "48px", marginBottom: "16px", display: "block" }}></iconify-icon>
                  <h3 style={{ margin: "0 0 8px" }}>No quote requests found</h3>
                  <p style={{ margin: 0 }}>You don't have any incoming requests for quotations right now.</p>
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Budget</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_QUOTES.map((q) => (
                      <tr key={q.id}>
                        <td><strong>{q.id}</strong></td>
                        <td>{q.client}</td>
                        <td>{q.service}</td>
                        <td>{q.budget}</td>
                        <td>{q.deadline}</td>
                        <td>
                          <span className={\`\${styles.status} \${styles[q.status]}\`}>{q.status}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {q.status === 'pending' && (
                              <>
                                <button className={\`\${styles.actionBtn} \${styles.actionBtnPrimary}\`}>Send Quote</button>
                                <button className={styles.actionBtn}>Decline</button>
                              </>
                            )}
                            {q.status !== 'pending' && (
                              <button className={styles.actionBtn}>View Details</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
`;

content = content.replace(tableRegex, emptyState.trim());

fs.writeFileSync(p, content, 'utf8');
