<script>
    import { onMount } from 'svelte';
    import { authenticated } from '../stores/auth.js';
    import { getTotalExpenses, calculateTransfers } from '../util/expenses.js';
    import { navigate } from 'svelte-routing';
    import { fetchDelete, fetchGet, fetchPost, fetchPut } from '../util/api.js';
  
    export let groupId;
    let group = null;
    let memberMessage = ""
    let expenses = [];
    let totalExpense;
    let transfers = []
  
    onMount(async () => {

        const memberCheck = await fetchGet(`/api/group/ismember/${groupId}`)

        if(memberCheck.status === 401) {
          navigate('/login')
          return;
        }

        console.log(memberCheck, 'memberCheck')

        if(memberCheck.data === false) {
          navigate('/mygroups')
        } else {
          authenticated.set(true);
          const groupRes = await fetchGet(`/api/group/${groupId}`)
          group = groupRes.data;
          const expenseRes = await fetchGet(`/api/expense/${groupId}`)
          console.log(expenseRes)
          expenses = expenseRes.data

          totalExpense = getTotalExpenses(expenses)
          transfers = calculateTransfers(expenses);
        }
      })

      

    let expense;
    let description;

    async function postExpense() {
      const postExpense = await fetchPost('/api/expense', { expense, description, groupId });
      if(postExpense.status === 201) {
        window.location.reload();
      }
    }

    let addedEmail;


    async function addMember() {
      let addedUserId;
      const existingMember = await fetchGet(`/api/user/${addedEmail}`)
      console.log(existingMember)

      if(existingMember.status === 401) {
        navigate('/login')
        return;
      }

      if(existingMember.status === 404) {
        memberMessage = existingMember.data.data;
      } else {
        addedUserId = existingMember.data.data.user_id;
      }

      const isMember = await fetchGet(`/api/group/ismember/${addedUserId}/${groupId}`)
      if(isMember.data === false) {
        const sendInvite = await fetchPost('/api/invite', { addedUserId, groupId })
        if(sendInvite.status === 401) {
          navigate('/login')
          return;
        }
        memberMessage = `An invite has been sent to ${addedEmail}`
        console.log(sendInvite)
      } else {
        memberMessage = 'User is already part of the group'
      }

    }

    async function deleteExpense(expenseId) {
      console.log(expenseId)
      const deleteExpenseRes = await fetchDelete(`/api/expense/${expenseId}`)
      if(deleteExpenseRes.status === 200) {
        window.location.reload();
      }
    }

    let updatedExpense;
    let updatedDescription;
    let expenseIdToUpdate;

    function openUpdate(expenseId) {
    const expenseToUpdate = expenses.find(expense => expense.expense_id === expenseId);
    if (expenseToUpdate) {
      updatedExpense = expenseToUpdate.expense;
      updatedDescription = expenseToUpdate.description;
      expenseIdToUpdate = expenseId;
      const modal = document.getElementById('updateExpense');
      modal.style.display = 'block';
    }
  }

  async function updateExpense() {
    const updateExpense = await fetchPut('/api/expense', { updatedExpense, updatedDescription, expenseIdToUpdate })
    if(updateExpense.status === 401) {
      navigate('/login');
    } else {
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
    <input bind:value={addedEmail} />
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
            {#if user_id === user_id}
            <td><button on:click={() => deleteExpense(expense_id)}><img class='table-svg' src="/red-cross.png" alt="x"></button></td>
            <td><button on:click={() => openUpdate(expense_id)}><img class='table-svg' src="/update.png" alt="%"></button></td>
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

  <form class="login" style="display: none;" id="updateExpense" on:submit|preventDefault={updateExpense}>
    <label for="expense">Update expense</label>
    <input bind:value={updatedExpense} />
    <label for="description">Update escription</label>
    <input bind:value={updatedDescription} />
    <button type="submit">Update expense</button>
  </form>

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


