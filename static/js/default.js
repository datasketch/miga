Vue.directive('detail-away', function (el, binding) {
  document.addEventListener('click', function (event) {
    if (!el.contains(event.target) && el.hasAttribute('open')) {
      el.removeAttribute('open');
    }
  });
});

new Vue({
  el: '#app',
  filters: {
    format(value) {
      if (!value) {
        return '';
      }
      const date = new Date(value);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    leading(value) {
      if (!value) {
        return '000';
      }
      const division = value / 10;
      if (division >= 1 || division < 10) {
        return `0${value}`;
      } else if (division < 1) {
        return `00${value}`;
      }
      return value;
    },
  },
  data() {
    return {
      loading: true,
      view: 'grid',
      cards: [],
      selectedOrganization: '',
      search: '',
    };
  },
  computed: {
    organizations() {
      return Array.from(new Set(this.cards.map((card) => card.author))).sort();
    },
    filteredCards() {
      let cards;
      if (this.selectedOrganization) {
        cards = this.cards.filter(
          (card) => card.author === this.selectedOrganization
        );
      } else {
        cards = this.cards;
      }
      return cards.filter(
        (card) =>
          card.title.toLowerCase().includes(this.search.toLowerCase()) ||
          card.description.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  async created() {
    try {
      let response = await fetch(
        'https://script.google.com/macros/s/AKfycbw17tfm6rZ35eWBJnrwswf_c6dGHk_Vy-lzHeUobvxNPKNoahE7/exec'
      );
      if (!response.ok) throw new Error("Could'nt fetch data");
      const { data } = await response.json();
      this.cards = data.catalogo.map((row) => ({
        title: row.nombre,
        author: row.fuente_de_datos,
        range: row.rango_de_recoleccion,
        updated_at: row.ultima_actualizacion,
        description: row.descripcion,
        link: row.enlace,
      }));
      this.loading = false;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    filterByOrganization(org) {
      document.querySelector('details[open]').removeAttribute('open');
      this.selectedOrganization = org;
    },
  },
});
