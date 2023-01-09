<template>
  <v-card width="300">
    <!-- 구역정보 -->
    <v-list>
      <v-list-group :value="true" prepend-icon="mdi-information-outline">
        <template v-slot:activator>
          <v-list-item-title>작물 정보</v-list-item-title>
        </template>

        <v-list-item v-for="(item, i) in newInfo" :key="i" link>
          <v-list-item-title class="d-flex">
            <p class="pr-3">{{ item.key }} :</p>
            <p>{{ item.content }}</p>
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
    <!-- 온실환경 -->
    <v-list>
      <v-list-group :value="true" prepend-icon="mdi-sprout">
        <template v-slot:activator>
          <v-list-item-title>구역 환경</v-list-item-title>
        </template>

        <v-list-item v-for="(item, i) in sensor" :key="i" link>
          <v-list-item-title class="d-flex">
            <p>{{ item.korean }}:</p>
            <p>{{ item.content }}</p>
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
    <!-- 개별센서조회 -->
    <!-- <v-list>
      <v-list-group
        :value="true"
        prepend-icon="mdi-hydraulic-oil-temperature
"
      >
        <template v-slot:activator>
          <v-list-item-title>개별센서 조회</v-list-item-title>
        </template>

        <v-list-item v-for="(item, i) in personalSensor" :key="i" link>
          <v-list-item-title class="d-flex">
            <v-checkbox
              v-model="selected"
              @change="checked()"
              :label="`${item.korean}`"
              :value="`${item.value}`"
            ></v-checkbox>
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
    <!-- 외부센서조회 -->
    <!-- <v-list>
      <v-list-group
        :value="true"
        prepend-icon="mdi-solar-power-variant-outline"
      >
        <template v-slot:activator>
          <v-list-item-title>외부센서 조회</v-list-item-title>
        </template>

        <v-list-item v-for="(item, i) in outSideSensor" :key="i" link>
          <v-list-item-title class="d-flex">
            <v-checkbox
              v-model="selected"
              @change="checked()"
              :label="`${item.korean}`"
              :value="`${item.value}`"
            ></v-checkbox>
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
    -->
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'MESFE2SideCard',

  data() {
    return {
      info: [
        {
          key: '작물명',
          content: '',
        },
        {
          key: '파종일',
          content: '',
        },
        {
          key: '작물상태',
          content: '',
        },
      ],
      sensor: [
        {
          col: 'temperature',
          korean: '온  도',
          icon: 'mdi-thermometer',
          content: '',
        },
        {
          col: 'humidity',
          korean: '습  도',
          icon: 'mdi-water-percent',
          content: '',
        },
        { col: 'CO2', korean: 'c o 2' },
        { col: 'rootZoneTemp', korean: '근 권 온 도' },
        { col: 'rootZoneTemp', korean: '근 권 수 분' },
        { col: 'rootZoneTemp', korean: '토 양 E C' },
        { col: 'rootZoneTemp', korean: '토 양 p H' },
      ],
      selected: [],
      newCropInfo: this.cropInfo,
    };
  },

  computed: {
    ...mapGetters({
      cropname: 'GET_CROPNAME',
      sowingday: 'GET_SOWINGDAY',
      cropstatus: 'GET_CROPSTATUS',
    }),
    newInfo: function () {
      return [
        { key: '작물명', content: this.cropname },
        { key: '파종일', content: this.sowingday },
        { key: '작물상태', content: this.cropstatus },
      ];
    },
  },

  methods: {
    checked() {
      console.log(this.selected);
      this.$emit('change', this.selected);
    },
    getCheck() {
      console.log('로.스로 체크한값');
      console.log(`${localStorage.getItem('cropname')}`);
      this.cropName = `${localStorage.getItem('cropname')}`;

      this.$store.commmit('setCropName', `${localStorage.getItem('cropname')}`);
      console.log('스테이트로 체크한값', `${this.$store.state.cropname}`);
      this.newCropName = `${this.$store.state.cropname}`;
      console.log('newCropName', this.newCropName);
    },
  },
};
</script>
<style scoped>
.v-application--is-ltr
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item::v-deep {
  padding-left: 20px;
  color: grey;
}
</style>
