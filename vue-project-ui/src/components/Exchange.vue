<template>
  <div>
    <h1>Super Exchange Currency</h1>
    <div class="exchange">
      <input type="number"
             v-model="amount"
             title="amount"
             placeholder="Amount" min="0"/>

      <select title="Currency from"
              v-model="currency.from">
        <option :key="currencyName"
                v-for="currencyName in nameOfCurrencies">{{ currencyName }}</option>
      </select>

      <select title="Currency to"
              v-model="currency.to">
        <option :key="currencyName"
                v-for="currencyName in nameOfCurrencies">{{ currencyName }}</option>
      </select>
    </div>
    <div class="result">
      {{ amount }} {{ currency.from }} to {{ currency.to }} = {{ result | toFixed }} {{ currency.to }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      amount: 0,
      currency: {
        from: 'USD',
        to: 'EUR'
      },
      currencies: {}
    }
  },
  computed: {
    result () {
      return this.amount * this.currencies[this.currency.from] * this.currencies[this.currency.to]
    },
    nameOfCurrencies () {
      return Object.keys(this.currencies)
    }
  },
  filters: {
    toFixed (value) {
      return Number.parseFloat(value).toFixed(3)
    }
  },
  mounted () {
    this.getCurrencies()
  },
  methods: {
    getCurrencies () {
      axios.get('http://data.fixer.io/api/latest?access_key=8a7a9a0df36f9bb007fc63614feeb357&')
        .then(response => {
          this.currencies = response.data.rates
        })
        .catch(error => {
          console.log(`Error: ${error}`)
        })
    }
  }
}
</script>

<style>
  .exchange{
    margin-top: 100px;
  }
  input,select{
    box-sizing: border-box;
    font-size: 2.2em;
    color:rgb(0,34,114);
    height:60px;
    padding-left: 20px;
    width: 200px;
    background:white;
    border:1px solid #555;
    border-radius:10px;
    margin-right: 10px;
  }
  input:focus{
    -webkit-box-shadow: 10px -10px 5px 0px rgba(122,240,230,1);
    -moz-box-shadow: 10px -10px 5px 0px rgba(122,240,230,1);
    box-shadow: 10px -10px 5px 0px rgba(122,240,230,1);
  }
  select:focus{
    -webkit-box-shadow: 10px -10px 5px 0px rgba(122,240,230,1);
    -moz-box-shadow: 10px -10px 5px 0px rgba(122,240,230,1);
    box-shadow: 10px -10px 5px 0px rgba(122,240,230,1);
  }
  .result{
    font-size: 44px;
    margin-top: 100px;
  }
</style>
