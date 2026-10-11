let history = [];
let next = [];

export default {
  init: ({ helper }) => {
    const target = document.getElementById("next-previous");
    target.innerHTML = `<li class="navigation__item"><a class="navigation__link" id="prev">Previous</a></li>
      <li class="navigation__item"><a class="navigation__link" id="next">Next</a></li>`;

    document.getElementById("next").addEventListener("click", () => {
      history.push(helper.getPage());
      const targetPage = next.length
        ? next.splice(0)[0]
        : parseInt(Math.random() * 1000);
      helper.setPage(targetPage);

      helper.search();
    });

    document.getElementById("prev").addEventListener("click", () => {
      const perviousPage = history.splice(history.length - 1)[0];

      next.unshift(helper.getPage());
      helper.setPage(perviousPage);

      helper.search();
    });
  }
};
