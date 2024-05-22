<script>
    import { onMount } from 'svelte'
    import { authenticated } from '../stores/auth.js';
    import { navigate } from 'svelte-routing';
    import { fetchGet } from '../util/api.js';
    
    let groups = [];
    let invites = [];

    onMount(async () => {
        const userRes = await fetchGet('/api/user')

        if(userRes.status === 200) {
            const user = userRes.data.user;
            authenticated.set(true)
            const groupRes = await fetchGet(`/api/group/my/${user.id}`)
            groups = groupRes.data;
        } else {
            navigate('/login')
        }
    
})

function navigateToGroup(groupId) {
    navigate(`/group/${groupId}`)
}


</script>

<h1 class="heading">My Groups</h1>

<div class='table-container'>
<table class="group-table">
    <thead>
        <tr>
            <th>Group Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        {#each groups as group}
            <tr>
                <td>
                    <a href="#" on:click|preventDefault={() => navigateToGroup(group.group_id)}>
                      {group.group_name}
                    </a>
                  </td>

                <td>{group.description}</td>
            </tr>
        {:else}
            <tr>
                <td colspan="2">No groups found. Go create one!</td>
            </tr>
        {/each}
    </tbody>
</table>
</div>

<h1 class="heading">Invites</h1>
<div class="table-container">
    <table class="group-table">
        <thead>
            <tr>
                <th></th>
                <th>Accept</th>
                <th>Decline</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    some@email sent you an invite to join GROUP_NAME
                </td>
                <td>
                    <img class='table-svg' src="/tick.png" alt="x">
                </td>
                <td>
                    <img class='table-svg' src="/red-cross.png" alt="x">
                </td>
            </tr>
        </tbody>
    </table>
</div>


