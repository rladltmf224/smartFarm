<template>
    <div class=" pt-12 ">
   <div  class=" d-flex justify-center " style="position: relative;    height: 300px; width: 500px">
     <canvas class="" ref="barChart" />
    </div>
<div class="d-flex justify-center mt-4">
    <h4 class="searchbox-title" v-if="this.graphData.dataName == 'avgInternodeLength'"   >절간장</h4>
    <h4 class="searchbox-title" v-if="this.graphData.dataName == 'avgLeafHeight'"   >초장</h4>
    <h4 class="searchbox-title" v-if="this.graphData.dataName == 'avgLeafLength'"   >엽장</h4>
    <h4 class="searchbox-title" v-if="this.graphData.dataName == 'avgLeafStage'"   >엽수</h4>
    <h4 class="searchbox-title" v-if="this.graphData.dataName == 'avgLeafWidth'"   >엽폭</h4>
    <h4 class="searchbox-title" v-if="this.graphData.dataName == 'avgStemThickness'"   >경경</h4>
</div>
</div>
  





 
</template>

<script>
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

export default {
    props: {
    graphData: {
      type: [Array, Object],
      default: null,
    }
  },
  data:() => ({
  
   
    type: 'line',
    data: {
      labels: ['2022','2023'],
      datasets: [
        {
          label: '1,1,1,1',
          data: [2, 3, 4, 5],
          fill: false,
          borderColor: 'red',
          tension: 0.1,
          backgroundColor: 'red',
          pointRadius: 3,
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          label: '1,2,1,1',
          data: [2, 3, 2, 4],
          fill: false,
          borderColor: 'blue',
          tension: 0.1,
          backgroundColor: 'blue',
          pointRadius: 3, //점 크기
          borderWidth: 1, //라인굵기
          yAxisID: 'y',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      stacked: false,
      events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
      interaction: {
        mode: 'index',
        intersect: false,
      },
      pan: {
        enabled: true,
        mode: 'x',
      },
      scales: {
        y1: {
          // beginAtZero: true,
        //   min: 0,
        //   max: 10,
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
          },
        },
        // y1: {
        //   type: 'linear',
        //   display: true,
        //   position: 'right',
        //   grid: {
        //     drawOnChartArea: false, // only want the grid lines for one axis to show up
        //   },
        //   min: 0,
        //   max: 10,
        //   title: {
        //     display: true,
           
        //   },
        //   grid: {
        //     drawOnChartArea: false, // only want the grid lines for one axis to show up
        //   },
        // },
        x: {
          ticks: {
            autoSkip: true, // 👈
            maxTicksLimit: 20, // 👈
          },
        },
      },

      plugins: {
        tooltip: {
          // Tooltip will only receive click events
         // events: ['mousemove'],
        },
        title: {
          display: true,
        },
        autocolors: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        autocolors: false,
        // annotation: {
        //   annotations: {
        //     line1: {
        //       type: 'line',
        //       yMin: 20,
        //       yMax: 20,
        //       borderColor: 'pink',
        //       borderWidth: 4,
        //     },
        //   },
        // },
        // zoom: {
        //   zoom: {
        //     wheel: {
        //       enabled: true,
        //     },
        //     pinch: {
        //       enabled: true,
        //     },
        //     mode: 'xy',
        //   },
        //   pan: {
        //     enabled: true,
        //   },
        //   limits: {
        //     x: { min: 0, max: 2e3, minRange: 10000000 },
        //     y: { min: 0, max: 10, minRange: 10 },
        //   },
        // },
      },
    },



  }),
  async mounted(){


    console.log('부모에서받은 데이타',this.graphData)
    this.resetDatas()
    this.makeDate()
    this.makeDatas()
   this.$nextTick(function () {
          this.createChart();
        });

  },
  methods:{
   createChart() {
      if (chart !== undefined) {
        chart.destroy();
      }
      var chart = new Chart(this.$refs.barChart, {
        type: 'line',
        data: this.data,
        options: this.options,
      });
      chart.update();
    },
    resetDatas(){
        this.data={
            labels:[],
            datasets:[]
        }
    },
    makeDatas(){
         let colors =[    'red','green','blue','yellow','purple','grey', 'pink','Aqua', 'Olive', 'Cadetblue',
         'Darkslategray', 'Lightsalmon','Mediumseagreen', 'Midnightblue','Tomato', ]
        let datasetsChild=[]
         for(let nameLeng = 0; nameLeng < this.graphData.treatmentData.length; nameLeng ++){

            datasetsChild.push({
                label:this.graphData.treatmentData[nameLeng].name,
                data:this.graphData.treatmentData[nameLeng].data,
                fill: false,
                borderColor:colors[nameLeng],
                tension: 0.1,
                backgroundColor: colors[nameLeng],
                pointRadius: 3,
                borderWidth: 1,
                yAxisID: 'y1',
            })
        }

      
               


        console.log('datasetsChild',datasetsChild)
        this.data.datasets=datasetsChild


    },
    makeLabels(){

        let nameArr = [] 
        for(let nameLeng = 0; nameLeng < this.graphData.treatmentData.length; nameLeng ++){

            nameArr.push(  this.graphData.treatmentData[nameLeng].name        )

        }

        console.log('nameArrnameArrnameArr',nameArr)
        this.data.labels=nameArr 

    },
   
    makeDate(){
        console.log('this.data.labels',this.data.labels)
        console.log('this.graphData.date',this.graphData.date)

        this.data.labels = this.graphData.date
                console.log('this.data.labels',this.data.labels)

    }
  }
}
</script>