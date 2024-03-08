<template>
  <div>
    <h3 class="text-xl py-4">search for people</h3>
    <div class="relative rounded-xl overflow-hidden">
      <input type="text" placeholder="type here..." class="p-2 pr-[50px] text-lg text-black outline-none">
      <button class="absolute top-1/2 translate-y-[-50%] right-0 flex p-1 items-center bg-blue-200">
        <box-icon name="search" color="black" size="md" class='transition-all hover:scale-105'></box-icon>
      </button>
    </div>
  </div>
</template>