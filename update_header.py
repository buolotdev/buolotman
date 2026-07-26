import re

with open('app/components/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the old event listeners in useEffect
content = re.sub(
    r'    const sideBtns = root\.querySelectorAll\("\.bmSideBtn"\);.*?attachHover\(\);\n',
    '',
    content,
    flags=re.DOTALL
)

# 2. Add handleMegaHover to React component body
react_hover_fn = """  const handleMegaHover = (e: React.MouseEvent) => {
    let target = e.target as HTMLElement;
    if (target.nodeType === 3) target = target.parentNode as HTMLElement;
    if (!target || !target.closest) return;
    const btn = target.closest('.bmSideBtn');
    if (btn) {
      const root = document.getElementById('bmMegaRoot');
      if (!root || !root.contains(btn)) return;
      root.querySelectorAll('.bmSideBtn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = (btn as HTMLElement).dataset.cat;
      root.querySelectorAll('.bmPanel').forEach((g: Element) => {
        (g as HTMLElement).style.display = 'none';
      });
      const panel = root.querySelector(`.bmPanel[data-panel="${cat}"]`) as HTMLElement | null;
      if (panel) panel.style.display = 'block';
    }
  };

  return ("""

content = content.replace('  return (', react_hover_fn)

# 3. Add onMouseOver to wrapper
content = content.replace(
    '<>\n      <div\n        dangerouslySetInnerHTML={{',
    '<div onMouseOver={handleMegaHover}>\n      <div\n        dangerouslySetInnerHTML={{'
)
content = content.replace('</>\n  );', '</div>\n  );')

with open('app/components/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
