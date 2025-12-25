<template>
  <div class="invoice-table">
    <table v-if="data">
      <thead v-if="data.items">
      <tr>
        <th>#</th>
        <th>{{ t("table.item") }}</th>
        <th>{{ t("table.qty") }}</th>
        <th>{{ t("table.cost") }}</th>
        <th>{{ t("table.total") }}</th>
      </tr>
      </thead>
      <tbody v-if="data.items">
      <tr v-for="(item, index) in data.items" :key="`item-${index}`">
        <td style="width: 1rem;">{{ index + 1 }}</td>
        <td>{{ item.name || 'Item' }}</td>
        <td style="width: 4rem;">{{ item.qty || '' }}</td>
        <td style="width: 4rem;"><Amount :amount="item.cost"/></td>
        <td style="width: 4rem;"><Amount :amount="item.total"/></td>
      </tr>
      </tbody>
    </table>
    <div class="invoice-table__bottom">
      <div v-if="data['sub-price']">
        <strong>{{ t("table.subtotal") }}:</strong>
        <Amount :amount="data['sub-price']" />
      </div>
      <div
        v-for="(tax, index) in data.extras"
        :key="`tax-${index}`"
      >
        <strong>{{ `${tax.name}:` || '' }}</strong>
        <Amount :amount="tax.price" />
      </div>
      <div v-if="data.price">
        <strong>{{ t("table.total") }}:</strong>
        <span>
          <strong v-if="typeof data.price === 'object' && data.price.amount">
            <Amount :amount="data.price.amount" />
            <span style="margin-left: 4px;" v-if="data.price.currency && typeof data.price.currency === 'string'">{{
                data.price.currency.toUpperCase()
              }}</span>
          </strong>
          <strong v-else>
            <Amount :amount="data.price" />
          </strong>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import Amount from '@/components/Amount.vue'

const props = defineProps({
  data: {
    default: null,
  },
})
</script>

<style lang="scss">
.dark-theme {
  .invoice-table {
    thead {
      tr {
        background: var(--dark-bg);
      }
    }

    tbody {
      tr {
        &:nth-of-type(even) {
          background: var(--dark-bg);
        }
      }
    }

    // th {
    //   background-color: var(--grey-e);
    //   color: var(--dark-primary);
    // }

    &__bottom > div {
      border-top: 1px solid var(--grey-e);
    }

    // tbody tr:nth-child(even) {
    //   background-color: var(--grey-e);
    //   color: var(--dark-primary);
    // }
  }
}

.light-theme {
  .invoice-table {
    th {
      background-color: var(--table-grey);
    }

    &__bottom > div {
      border-top: 1px solid var(--light-grey);
    }

    tbody tr:nth-child(even) {
      background-color: var(--table-grey);
    }
  }
}

.invoice-table {
  &__bottom {
    max-width: 15rem;
    margin: 16px 0 0 auto;

    & > div {
      display: flex;
      justify-content: space-between;
      padding: .5rem;
      &:first-child {
        border-top: initial !important;
      }
    }
  }

  table {
    margin-top: 1rem;
    box-sizing: border-box;
    text-indent: initial;
    border-spacing: 2px;
    border-color: var(--dark-grey);
    border-collapse: collapse;
    display: table;
    overflow-x: auto;
    width: 100%;
  }

  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
  }

  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }

  th, td {
    padding: 8px;
    text-align: center;
    border-image: initial;
  }

  tbody td:nth-child(1), thead th:nth-child(1), tbody td:nth-child(2), thead th:nth-child(2) {
    text-align: left;
  }

  tbody td:nth-child(5), thead th:nth-child(5) {
    text-align: right;
  }

  th {
    font-weight: bold;
    display: table-cell;
    vertical-align: inherit;
  }

}

@media (max-width: 400px) {
  .invoice-table {
    & th, td, .invoice-table__bottom {
      font-size: 14px;
    }
  }
}

</style>
