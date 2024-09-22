<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        weekends: false, // initial value
        dateClick: this.handleDateClick,
        events: [
          { title: "event 1", date: "2019-04-01" },
          { title: "event 2", date: "2019-04-02" },
        ],
      },
    };
  },
  methods: {
    handleDateClick: function (arg) {
      alert("date click! " + arg.dateStr);
    },
    toggleWeekends: function () {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
    },
  },
};
</script>
<template>
  <div>
    <button @click="toggleWeekends">toggle weekends</button>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>