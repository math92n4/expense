<script>
    import { onMount } from 'svelte';
    import { authenticated } from '../stores/auth.js';
    import { getTotalExpenses, calculateTransfers } from '../util/expenses.js';
    import { navigate } from 'svelte-routing';
    import { fetchDelete, fetchGet, fetchPost } from '../util/api.js';
  
    export let groupId;
    let userId;
    let group = null;
    let email
    let memberMessage = ""
    let expenses = [];
    let totalExpense;
    let transfers = []
  
    onMount(async () => {

      

      const userRes = await fetchGet('/api/user');
      console.log(userRes)
      if(userRes.status === 401) {
        navigate('/login')

      } else {
        authenticated.set(true)
        userId = userRes.data.user.id
      }

      const memberCheck = await fetchGet(`/api/group/ismember/${userId}/${groupId}`)
      console.log(memberCheck, 'memberCheck')

      if(memberCheck.data === false) {
        navigate('/mygroups')
        
      } else {
        const groupRes = await fetchGet(`/api/group/${groupId}`)
        group = groupRes.data;
        const expenseRes = await fetchGet(`/api/expense/${groupId}`)
        console.log(expenseRes)
        expenses = expenseRes.data

        totalExpense = getTotalExpenses(expenses)
        transfers = calculateTransfers(expenses);
      }

    });

    let expense;
    let description;

    async function postExpense() {
      const postExpense = await fetchPost('/api/expense', { expense, description, userId, groupId });
      if(postExpense.status === 201) {
        window.location.reload();
      }
    }

    async function addMember() {
      const userRes = await fetchGet(`/api/user/${email}`)
      console.log(userRes)

      if(userRes.status === 200) {
        const user = userRes.data.data;
        const userId = user.user_id;

        const postMember = await fetchPost("/api/member", { userId, groupId })

        if(postMember.status === 200) {
          memberMessage = `${email} has been invited`
          return;
        }
      } else if(userRes.status === 404) {
        memberMessage = `${userRes.data.data} with email ${email}`
      }
    }

    async function deleteExpense(expenseId) {
      console.log(expenseId)
      const deleteExpenseRes = await fetchDelete(`/api/expense/${expenseId}`)
      if(deleteExpenseRes.status === 200) {
        window.location.reload();
      }
    }

  </script>
  
  {#if group}
    <h1 class="heading">{group.group_name}</h1>

  {:else}
    <p>Loading...</p>
  {/if}
  
  <form class="login" on:submit|preventDefault={addMember}>
    <label for="email">Email</label>
    <input bind:value={email} />
    <button type="submit">Add member</button>
    {#if memberMessage}
    <p class='error'>{memberMessage}</p>
    {/if}
  </form>

  

  <div class="table-container">
    <table class="group-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Expense</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#if expenses.length > 0}
        {#each expenses as { user_id, email, expense, expense_id, description }}
          <tr>
            <td>{email}</td>
            <td>{expense}</td>
            <td>{description}</td>
            {#if userId === user_id}
            <td><button on:click={() => deleteExpense(expense_id)}><img class='table-svg' src="/red-cross.png" alt="x"></button></td>
            {/if}
          </tr>
        {/each}
        {:else}
        <tr>
          <td colspan="4">No expenses yet</td>
        </tr>
        {/if}
      </tbody>
    </table>
  </div>

  <p class='total-expense'>Total expense: {totalExpense}</p>


  <form class="login" on:submit|preventDefault={postExpense}>
    <label for="expense">Expense</label>
    <input bind:value={expense} />
    <label for="description">Description</label>
    <input bind:value={description} />
    <button type="submit">Add expense</button>
</form>

  {#if transfers.length > 0}

  <div class='table-container' style="margin-bottom: 100px;">
  <table class="group-table" >
    <thead>
      <tr>
        <th>From</th>
        <th>To</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {#each transfers as { userFrom, userTo, amount }}
        <tr>
          <td>{userFrom}</td>
          <td>{userTo}</td>
          <td>{amount}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  </div>

  {:else}
  <p class="total-expense">No expenses to be shared!</p>
  {/if}


