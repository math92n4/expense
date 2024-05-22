<script>
    
    import { fetchPost } from "../util/api";
    import { navigate } from "svelte-routing";

    let email = '';
    let password = '';
    let errorMessage = '';

    async function signUp() {
        const post = await fetchPost('/api/user', { email, password })

        if(post.status === 400) {
            errorMessage = 'Password or email is missing';
        } else if(post.status === 409) {
            errorMessage = 'Email already exist';
        } else if(post.status === 201) {

            const login = await fetchPost('/api/login', { email, password })

            if(login.status === 200) {
                navigate('/mygroups')
            }
            
        }      
    }

</script>


<form class="login" on:submit|preventDefault={signUp}>
    <h1>Sign up</h1>
    <label for="email">Email</label>
    <input type="email" bind:value={email} />
    <label for="password">Password</label>
    <input type="password" bind:value={password} />
    <button type="submit">Sign up</button>
    {#if errorMessage}
    <p class='error'>{errorMessage}</p>
    {/if}
</form>