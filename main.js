const tabItems = document.querySelectorAll(".tab-item");
const tabContentItems = document.querySelectorAll(".tab-content-item");
//select tab content item
function selectItem(e) {
  //remove border from all tab items
  removeBorder();
  removerShow();
  //add border to current tab content
  this.classList.add("tab-border");
  //grab content item from DOM
  const selectedTab = document.getElementById(`${this.id}-content`);
  selectedTab.classList.add("show");
}

//func to remove border from all tab items
const removeBorder = () => {
  tabItems.forEach((item) => item.classList.remove("tab-border"));
};

//remove show
const removerShow = () => {
  tabContentItems.forEach((tab) => tab.classList.remove("show"));
};

//Listen for tab click
tabItems.forEach((item) => item.addEventListener("click", selectItem));
