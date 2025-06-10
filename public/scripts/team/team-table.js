export default function renderTeamRow(team, $tableBody) {
  const $row = document.createElement("tr");
  $row.innerHTML = `
              <td>${team.id}</td>
              <td>${team.name}</td>
            
              
            `;
  $tableBody.appendChild($row);
}
