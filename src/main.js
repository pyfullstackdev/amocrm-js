let currentlyExpandedCardId = null;

const fetchLimitedCards = async () => {
  try {
    const cards = await fetchCards();
    displayCards(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
}

const displayCards = async (cards) => {
  const tableBody = document.getElementById("dealsTable");
  tableBody.innerHTML = "";

  cards.forEach((card) => {
    const row = document.createElement("tr");
    row.classList.add("hover:bg-gray-100", "cursor-pointer");
    row.dataset.cardId = card.id;

    row.innerHTML = `
            <td class="py-2 px-4 border-b">${card.id}</td>
            <td class="py-2 px-4 border-b">${card.name}</td>
            <td class="py-2 px-4 border-b">${card.budget}</td>`;

    row.addEventListener("click", () => toggleExpandedCard(card.id));

    tableBody.appendChild(row);
  });
}

const toggleExpandedCard = async (cardId) => {
  const tableBody = document.getElementById("dealsTable");

  if (currentlyExpandedCardId && currentlyExpandedCardId !== cardId) {
    closeExpandedCard(currentlyExpandedCardId);
  }

  if (currentlyExpandedCardId === cardId) {
    closeExpandedCard(cardId);
    return;
  }

  currentlyExpandedCardId = cardId;

  try {
    const expandedData = await fetchExpandedData(cardId);
    displayExpandedCard(cardId, expandedData);
  } catch (error) {
    console.error("Error fetching expanded data:", error);
  }
}

function closeExpandedCard(cardId) {
  const tableBody = document.getElementById("dealsTable");
  const row = [...tableBody.rows].find((row) => row.dataset.cardId == cardId);
  if (
    row.nextElementSibling &&
    row.nextElementSibling.classList.contains("expanded-row")
  ) {
    row.nextElementSibling.remove();
  }
  currentlyExpandedCardId = null;
}

const displayExpandedCard = async (cardId, expandedData) =>  {
  const tableBody = document.getElementById("dealsTable");
  const row = [...tableBody.rows].find((row) => row.dataset.cardId == cardId);

  const expandedRow = document.createElement("tr");
  expandedRow.classList.add(
    "bg-gray-50",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "expanded-row"
  );

  expandedRow.innerHTML = `
        <td colspan="3" class="py-2 px-4 border-b">
            <div>
                <strong>Date:</strong> ${await formatDate(expandedData.creationDate)}<br>
                <strong>Status:</strong> ${await createStatusCircle(expandedData.taskStatus)}
            </div>
        </td>`;

  row.parentNode.insertBefore(expandedRow, row.nextSibling);
}

window.onload = fetchLimitedCards;

const createStatusCircle = async (taskStatus) => {
  const currentDate = new Date();
  const dueDate = new Date(taskStatus.dueDate);
  let color;

  if (
    !taskStatus ||
    !taskStatus.dueDate ||
    dueDate < currentDate.setDate(currentDate.getDate() - 1)
  ) {
    color = "red";
  } else if (dueDate.toDateString() === currentDate.toDateString()) {
    color = "green";
  } else {
    color = "yellow";
  }

  return `
    <div class="inline-block align-middle">
      <svg width="20" height="20">
        <circle cx="10" cy="10" r="10" fill="${color}" />
      </svg>
    </div>`;
}

const formatDate = async (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
}

const fetchCards = async () => {
  return [
    {
      id: "1",
      name: "Deal 1",
      budget: 1000,
      creationDate: "2023-09-20T00:00:00Z",
    },
    {
      id: "2",
      name: "Deal 2",
      budget: 2000,
      creationDate: "2023-09-19T00:00:00Z",
    },
    {
      id: "3",
      name: "Deal 3",
      budget: 1500,
      creationDate: "2023-09-18T00:00:00Z",
    },
  ];
}

const fetchExpandedData = async (cardId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const expandedCardData = {
    1: {
      id: "1",
      name: "Deal 1",
      budget: 1000,
      creationDate: "2023-09-20T00:00:00Z",
      taskStatus: { dueDate: "2023-09-21T00:00:00Z" },
    },
    2: {
      id: "2",
      name: "Deal 2",
      budget: 2000,
      creationDate: "2023-09-19T00:00:00Z",
      taskStatus: { dueDate: "2023-09-29T00:00:00Z" },
    },
    3: {
      id: "3",
      name: "Deal 3",
      budget: 1500,
      creationDate: "2023-09-18T00:00:00Z",
      taskStatus: { dueDate: "2023-09-21T00:00:00Z" },
    },
  };

  return (
    expandedCardData[cardId] || {
      id: cardId,
      name: `Deal ${cardId}`,
      budget: 1000,
      creationDate: "2023-09-20T00:00:00Z",
      taskStatus: { dueDate: "2023-09-20T00:00:00Z" },
    }
  );
}
