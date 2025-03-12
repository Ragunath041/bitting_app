using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class BiddingHub : Hub
{
    public async Task SendBid(string productId, decimal amount)
    {
        await Clients.All.SendAsync("ReceiveBid", productId, amount);
    }
}