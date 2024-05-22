<script>
    import { onMount } from 'svelte'
    import { authenticated } from '../stores/auth.js';
    import { fetchGet, fetchPost } from '../util/api.js';
    import { navigate } from 'svelte-routing';

    onMount(async () => {
        
        try {
            await fetchGet('/api/user');
            authenticated.set(true);
        } catch(error) {
            navigate('/login')
        }
        

    })

    let groupName = '';
    let groupDesc = '';

    async function createGroup() {
        try {
            fetchPost('/api/group', { groupName, groupDesc })
            navigate('/mygroups')
        } catch(error) {
            console.log(error)
        }

    }
</script>


<form class="login" on:submit|preventDefault={createGroup}>
    <h1>Create group</h1>
    <label for="groupName">Group Name</label>
    <input bind:value={groupName}/>
    <label for="groupDesc">Group Description</label>
    <input bind:value={groupDesc}/>
    <button type="submit">Create Group</button>
</form>