const cards = [
    { id: 1, name: "Card A", point: 50, group: 1, region: "A" },
    { id: 2, name: "Card B", point: 80, group: 2, region: "B" },
    { id: 3, name: "Card C", point: 120, group: 1, region: "A" }
  ];
  
  const selected = new Set();
  
  function renderTable() {
    const search = document.getElementById("searchBox").value.toLowerCase();
    const sortRegion = document.getElementById("sortRegion").value;
    const filterGroup = document.getElementById("filterGroup").value;
  
    let list = cards.filter(c =>
      c.name.toLowerCase().includes(search) &&
      (filterGroup ? c.group == filterGroup : true)
    );
  
    if (sortRegion) list = list.filter(c => c.region === sortRegion);
  
    document.getElementById("cardTable").innerHTML = list.map(c => `
      <tr>
        <td><input type="checkbox" ${selected.has(c.id) ? "checked" : ""} onclick="toggle(${c.id})"></td>
        <td><div class='card-pic'></div> ${c.name}</td>
        <td>${c.point}</td>
        <td>${c.group}</td>
        <td>${c.id}</td>
      </tr>
    `).join("");
  
    updateFusion();
  }
  
  function toggle(id) {
    selected.has(id) ? selected.delete(id) : selected.add(id);
    updateFusion();
  }
  
  function resetCards() {
    selected.clear();
    renderTable();
  }
  
  function selectAll() {
    cards.forEach(c => selected.add(c.id));
    renderTable();
  }
  
  function reverseSelect() {
    cards.forEach(c => selected.has(c.id) ? selected.delete(c.id) : selected.add(c.id));
    renderTable();
  }
  
  function updateFusion() {
    let total = 0;
    selected.forEach(id => {
      const c = cards.find(x => x.id === id);
      if (c) total += c.point;
    });
  
    document.getElementById("fusionPoint").textContent = total;
    document.getElementById("rate").textContent = (total / 500 * 100).toFixed(1) + "%";
  }
  
  renderTable();
  