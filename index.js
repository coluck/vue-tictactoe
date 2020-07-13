Vue.component('Square', {
  props: ['value', 'i'],
  template: `<button class="square" @click='onClick(i)'>{{ value }}</button>`,
  methods: {
    onClick(i) {
      this.$root.$emit('handleClick', i)
    }
  }
});

Vue.component('Board', {
  props: ['squares'],
  template: `
  <div>
    <div class="board-row">
      <square :value=squares[0] i=0></square>
      <square :value=squares[1] i=1></square>
      <square :value=squares[2] i=2></square>
    </div>
    <div class="board-row">
      <square :value=squares[3] i=3></square>
      <square :value=squares[4] i=4></square>
      <square :value=squares[5] i=5></square>
    </div>
    <div class="board-row">
      <square :value=squares[6] i=6></square>
      <square :value=squares[7] i=7></square>
      <square :value=squares[8] i=8></square>
    </div>
  </div>
  `,

});

let game = new Vue({
  el: '#app',
  name: 'game',
  data: {
    history: [
      {
        squares: Array(9).fill(null),
      },
    ],
    stepNumber: 0,
    xIsNext: true,
  },
  mounted() {
    this.$root.$on('handleClick', (value) => {
      this.handleClick(value);
    });
  },
  
  methods: {
    jumpTo(step) {
      this.stepNumber = step;
      this.xIsNext = (step % 2) === 0;
    },
    handleClick(i) {
      const history = this.history.slice(0, this.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.xIsNext ? "X" : "O";
      this.history= history.concat([
        {
          squares: squares,
        },
      ]);
      this.stepNumber = history.length;
      this.xIsNext = !this.xIsNext;
    },
  },
  computed: {
    status: function() {
      const winner = calculateWinner(this.history[this.stepNumber].squares);
      let st;
      if (winner) {
        st = "Winner: " + winner;
      } else {
        st = "Next player: " + (this.xIsNext ? "X" : "O");
      }
      return st;
    },
  }
});

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
