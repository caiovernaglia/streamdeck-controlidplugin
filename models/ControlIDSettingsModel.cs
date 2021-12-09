namespace ControlID.Models
{
  public class ControlIDSettingsModel
  {
    public string IP { get; set; } = "";
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string Session { get; set; } = "";


    public string EndPoint_Login = "/login.fcgi";
    public string EndPoint_Action = "/execute_actions.fcgi";
  }
}
