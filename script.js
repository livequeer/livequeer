// script.js
const sheetID = "1Di2ygCHjmMP20lDnvwnv4qInyvjeUhDYy-b6EuupOhY";
const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`; 
const query = encodeURIComponent("Select *");
const url = `${base}&tq=${query}`;

fetch(url)
  .then(res => res.text())
  .then(rep => {
    const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
    const data = jsonData.table.rows.map(row => row.c.map(cell => cell ? cell.v : ""));
    const events = data.slice(1).map(row => ({
      date: row[0],
      name: row[1],
      desc: row[2],
      location: row[3],
      link: row[4],
      category: row[5],
      tags: row[6]?.split(',').map(t => t.trim().toLowerCase()),
      access: row[7],
    }));
    renderEvents(events);
    renderTags(events);
  });

function renderEvents(events) {
  const list = document.getElementById("event-list");
  const highlights = document.getElementById("highlight-list");
  list.innerHTML = "";
  highlights.innerHTML = "";

  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  events.forEach((e, i) => {
    const el = document.createElement("div");
    el.className = "event-card";
    el.innerHTML = `
      <h3>${e.name}</h3>
      <p><strong>Date:</strong> ${e.date}</p>
      <p><strong>Location:</strong> ${e.location}</p>
      <p>${e.desc}</p>
      <p><strong>Tags:</strong> ${e.tags?.join(', ') || 'None'}</p>
      <p><strong>Access:</strong> ${e.access}</p>
      <a href="${e.link}" target="_blank">More Info</a>
    `;
    list.appendChild(el);

    if (i < 3) highlights.appendChild(el.cloneNode(true));
  });
}

function renderTags(events) {
  const tagBox = document.getElementById("tag-filters");
  tagBox.innerHTML = "";
  const tags = new Set(events.flatMap(e => e.tags || []));

  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.onclick = () => filterByTag(tag, events);
    tagBox.appendChild(btn);
  });
}

function filterByTag(tag, events) {
  const filtered = events.filter(e => e.tags?.includes(tag));
  renderEvents(filtered);
}