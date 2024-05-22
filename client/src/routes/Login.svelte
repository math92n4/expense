<script>

    import { fetchPost } from "../util/api";
    import { navigate } from "svelte-routing";

    let email = '';
    let password = '';
    let errorMessage = ''

    async function login() {
        const login = await fetchPost('/api/login', { email, password })
    
        if(login.status === 200) {
            navigate('/mygroups')
        } else {
            errorMessage = login.data.message
        }
    }

</script>


<form class="login" on:submit|preventDefault={login}>
    <h1>Log in</h1>
    <label for="email">Email</label>
    <input type="email" bind:value={email}/>
    <label for="password">Password</label>
    <input type="password" bind:value={password}/>
    <button type="submit">Log in</button>
    {#if errorMessage}
    <p class='error'>{errorMessage}</p>
    {/if}
</form>
