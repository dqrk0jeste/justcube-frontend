<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Pagination, Zoom, Navigation } from 'swiper/modules'

  import 'swiper/css'
  import 'swiper/css/zoom'
  import 'swiper/css/pagination'
  import 'swiper/css/navigation'

  const { id, imageCount } = defineProps<{
    id: string,
    imageCount: number,
  }>()


</script>

<template>
  <div>
    <Swiper
      class="rounded-lg relative"
      :modules="[Pagination, Zoom, Navigation]"
      :grab-cursor="true"
      :loop="false"
      :auto-height="true"
      :pagination="{ progressbarOpposite: true, clickable: true, }"
      :navigation="{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', }"
      :zoom="{ maxRatio: 3 }"
    >
      <SwiperSlide v-for="i in imageCount">
        <div class="w-full h-full flex items-center rounded-lg swiper-zoom-container">
          <img :src="`https://letscube.s3.eu-north-1.amazonaws.com/${ id }_${ i - 1 }.jpg`" alt="">
        </div>
      </SwiperSlide>
      <div class="swiper-button-next hover:scale-110 transition-all"></div>
      <div class="swiper-button-prev hover:scale-110 transition-all"></div>
    </Swiper>
  </div>
</template>

<style>
  :root {
    --swiper-navigation-size: 2rem;
  }

  .swiper-button-next:after, 
  .swiper-button-prev:after {
    color: white;
    padding: 2rem 1rem;
  }

  .swiper-button-disabled {
    display: none;
  }

  .swiper-pagination-bullet-active {
    background-color: white;
  }
</style>