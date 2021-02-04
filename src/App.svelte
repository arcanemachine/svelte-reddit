<script>
	export let name;
</script>

<main>
  <div class="section">
    <div class="container">
      <div class="title has-text-centered">Bulma</div>
    </div>
  </div>
	<h1>Hello {name}!</h1>
</main>

<style>

body {
  overflow-y: auto; /* bulma compatibility */
}

.page-container {
  width: 100vw;
  min-height: 100vh;
}

</style>
