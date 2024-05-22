<script>
    import { authenticated } from "../stores/auth"
    import { navigate } from "svelte-routing";

    let auth = false;
    authenticated.subscribe(a => auth = a)

    async function logOut() {
        const res = await fetch('http://localhost:8080/api/logout', {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        })

        if(res.ok) {
            navigate('/login')
        }
    }

</script>

{#if auth}
<nav class="navbar">
    <ul class="navbar-links">
        <li><a href="/group">Create group</a></li>
        <li><a href="/mygroups">My groups</a></li>
        <li><a href="/login" on:click={ logOut }>Logout</a></li>
    </ul>
</nav>

{:else }
<nav class="navbar">
    <ul class="navbar-links">
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Sign up</a></li>
    </ul>
</nav>
{/if}

