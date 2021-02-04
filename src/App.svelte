<script>
	import Navbar from './components/Navbar.svelte';

  $: title = 'reddit';
</script>

<div class="page-container">
  <Navbar title="{title}"/>
  <div class="section">
    <div class="container">
      <div class="title has-text-centered">Bulma</div>
    </div>
  </div>
  <main class="content-container">
  </main>
</div>


<style>

.page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

.content-container {
  flex-grow: 1;
}

</style>
