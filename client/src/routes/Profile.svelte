<script>
    import { onMount } from "svelte";
    import { fetchGet, fetchPut, fetchDelete } from "../util/api";
    import { navigate } from "svelte-routing";
    import { authenticated } from "../stores/auth";

    let newEmail;
    let oldPassword;
    let newPassword;
    let message;


    onMount(async () => {
        authenticated.set(true)
        const userRes = await fetchGet('/api/user')
        console.log(userRes)
        
        if(userRes.status === 401) {
            navigate('/');
        } else {
            newEmail = userRes.data.email;
        }   
    })

    async function updateUser() {
        const updateUserRes = await fetchPut('/api/user', { newEmail, oldPassword, newPassword })
        if(updateUserRes.status === 401) {
            navigate('/')
        } else {
            message = updateUserRes.data.message;
        }
    }

    async function deleteAccount() {
        const deleteUserRes = await fetchDelete('/api/user');
        navigate('/')
    }

</script>


<form class="login" on:submit|preventDefault={updateUser}>
    <h1>Update Account</h1>
    <label for="email">Email</label>
    <input type="email" bind:value={newEmail}/>
    <label for="password">Old password</label>
    <input type="password" bind:value={oldPassword}/>
    <label for="password">New password</label>
    <input type="password" bind:value={newPassword}/>
    {#if message}
    <p class="error">{message}</p>
    {/if}
    <button type="submit">Update Account</button>
</form>
<button style="background-color: red;" on:click={deleteAccount}>Delete Account</button>

