<script>
    import { authenticated } from "../stores/auth"
    import { navigate } from "svelte-routing";
    import { fetchPost } from "../util/api";

    let auth = false;
    authenticated.subscribe(a => auth = a)

    async function logOut() {
        await fetchPost('/api/logout')
        navigate('/login')
    }

</script>

{#if auth}
<nav class="navbar">
    <ul class="navbar-links">
        <li><a href="/group">Create group</a></li>
        <li><a href="/mygroups">My groups</a></li>
        <li><a href="/" on:click={ logOut }>Logout</a></li>
    </ul>
</nav>

{:else }
<nav class="navbar">
    <ul class="navbar-links">
        <li><a href="/">Login</a></li>
        <li><a href="/signup">Sign up</a></li>
    </ul>
</nav>
{/if}

